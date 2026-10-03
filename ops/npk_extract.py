# -*- coding: utf-8 -*-
"""NPK 容器读取（NeoX npk 格式）。

条目布局（解包自 npk.dll 的 NpkReader::DoOpen / Load）：

    文件头 24 字节
        +0x00 u32  magic 'NXPK'
        +0x04 u32  条目数
        +0x08 u32  索引偏移高 32 位
        +0x0c u8   索引加密类型（0 = 不加密）
        +0x0d u8   文件名格式标志（bit0 = 1 用新格式）
        +0x14 u32  索引偏移低 32 位
    索引 count * 28 字节，每项
        +0x00 u32  名称哈希
        +0x04 u32  数据偏移低 32 位（+0x1b 为高 8 位）
        +0x08 u32  压缩后大小
        +0x0c u32  原始大小
        +0x10 u32  校验
        +0x14 u32  校验
        +0x18 u16  压缩类型（0 无 / 1 zlib / 3 zstd）
        +0x1a u8   加密类型（0 无 / 1 SimpleCrypt）
        +0x1b u8   数据偏移第 33-40 位
    紧跟索引：16 字节文件名块头
        +0x00 u32  magic 'NXFN'
        +0x04 u32  flags（低字节 = 加密类型，次字节 = 压缩类型）
        +0x08 u32  存储大小
        +0x0c u32  原始大小
    之后是文件名数据：NUL 分隔的路径，顺序与索引一一对应

加密类型 1 = neox::SimpleCrypt，只异或每条数据的前 128 字节：
    buf[i] ^= (i + key) & 0xFF
key 取 NpkReader 的 NeoXKey 首字节，本作实测为 0x63。
"""
import struct
import ctypes
import os

MAGIC_NXPK = 0x4B50584E
MAGIC_NXFN = 0x4E46584E
DEFAULT_KEY = 0x63
INDEX_ENTRY_SIZE = 28


def _load_zstd(zstd_dll):
    if zstd_dll:
        return ctypes.CDLL(zstd_dll)
    for cand in (r'D:\星际猎人\client\zstd.dll',):
        if os.path.exists(cand):
            return ctypes.CDLL(cand)
    return None


_ZSTD = _load_zstd(None)


def simple_crypt(buf, key=DEFAULT_KEY):
    """neox::SimpleCrypt：仅处理前 128 字节。"""
    b = bytearray(buf)
    for i in range(min(len(b), 0x80)):
        b[i] ^= (i + key) & 0xFF
    return bytes(b)


def decompress(comp, src, orig_size):
    if comp == 3:
        if _ZSTD is None:
            raise RuntimeError('需要 zstd.dll 才能解压类型 3 的条目')
        dst = ctypes.create_string_buffer(max(int(orig_size), 1))
        n = _ZSTD.ZSTD_decompress(dst, ctypes.c_size_t(int(orig_size)),
                                  src, ctypes.c_size_t(len(src)))
        if _ZSTD.ZSTD_isError(ctypes.c_ulong(n)):
            raise RuntimeError('zstd 解压失败: %s' % _ZSTD.ZSTD_getErrorName(ctypes.c_ulong(n)))
        return dst.raw[:n]
    if comp == 1:
        import zlib
        return zlib.decompress(src)
    return src[:orig_size] if orig_size else src


class NpkReader(object):
    def __init__(self, path):
        self.path = path
        self.f = open(path, 'rb')
        hdr = self.f.read(0x18)
        if len(hdr) < 0x18 or struct.unpack_from('<I', hdr, 0)[0] != MAGIC_NXPK:
            raise ValueError('不是 npk 文件: %s' % path)
        self.count = struct.unpack_from('<I', hdr, 4)[0]
        hi = struct.unpack_from('<I', hdr, 8)[0]
        self.index_encrypt = hdr[0x0C]
        lo = struct.unpack_from('<I', hdr, 0x14)[0]
        self.index_off = (hi << 32) | lo
        self.f.seek(self.index_off)
        index = self.f.read(self.count * INDEX_ENTRY_SIZE)
        if self.index_encrypt:
            index = simple_crypt(index)
        self.index = index
        self._names = None

    def close(self):
        self.f.close()

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        self.close()

    def entry(self, i):
        h, off, size, orig, c1, c2, c3 = struct.unpack_from('<7I', self.index, i * INDEX_ENTRY_SIZE)
        return {
            'i': i, 'hash': h, 'offset': off | (((c3 >> 24) & 0xFF) << 32),
            'size': size, 'orig': orig, 'comp': c3 & 0xFFFF,
            'enc': (c3 >> 16) & 0xFF, 'crc1': c1, 'crc2': c2,
        }

    def names(self):
        if self._names is None:
            self.f.seek(self.index_off + self.count * INDEX_ENTRY_SIZE)
            head = self.f.read(16)
            magic, flags, size, orig = struct.unpack_from('<IIII', head, 0)
            if magic != MAGIC_NXFN:
                raise ValueError('无文件名块 (magic=%s)，可能是不带新格式文件名的 npk' % hex(magic))
            raw = self.f.read(size)
            if flags & 0xFF:
                raw = simple_crypt(raw)
            raw = decompress((flags >> 8) & 0xFF, raw, orig)
            self._names = [x.decode('utf-8', 'replace') for x in raw.split(b'\0') if x]
        return self._names

    def read_index(self, i):
        e = self.entry(i)
        self.f.seek(e['offset'])
        raw = self.f.read(e['size'])
        if e['enc']:
            raw = simple_crypt(raw)
        return decompress(e['comp'], raw, e['orig'])

    def read(self, name):
        return self.read_index(self.names().index(name))