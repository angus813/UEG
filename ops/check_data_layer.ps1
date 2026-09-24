# 页面数据层自检：凡是用到 window.DB 的页面，都必须显式引入根目录的 config.js + github-db.js
# 背景：supabase-client.js 只在调用 supabase.from() 时才懒加载数据层，
#       漏引的页面（自身或它加载的 js 里直接用 DB.）会报「DB is not defined」。
# 用法：powershell -ExecutionPolicy Bypass -File ops\check_data_layer.ps1   （退出码 0=通过，1=有问题）
$ErrorActionPreference = 'Stop'
$root  = Split-Path -Parent $PSScriptRoot
$pages = Get-ChildItem -Path $root -Recurse -Filter *.html -File |
         Where-Object { $_.FullName -notmatch '\\\.git\\|\\pyodide\\' }
$bad = @()

foreach ($page in $pages) {
  $html = Get-Content -Raw -LiteralPath $page.FullName

  # 页面自身或它引用的 js 里是否出现 DB.（数据层自身 github-db.js / 兼容层 supabase-client.js 不算）
  $used = [bool]($html -match '\bDB\.')
  if (-not $used) {
    foreach ($m in [regex]::Matches($html, '<script[^>]+src="([^"]+\.js)"')) {
      $name = [IO.Path]::GetFileName($m.Groups[1].Value)
      if ($name -in 'github-db.js', 'supabase-client.js') { continue }
      $js = Join-Path $page.DirectoryName $m.Groups[1].Value
      if ((Test-Path -LiteralPath $js) -and ((Get-Content -Raw -LiteralPath $js) -match '\bDB\.')) { $used = $true; break }
    }
  }
  if (-not $used) { continue }

  # 是否显式引入，且相对路径确实解析到仓库根目录的那两个文件
  $miss = @()
  foreach ($need in 'config.js', 'github-db.js') {
    $ok = $false
    foreach ($m in [regex]::Matches($html, '<script[^>]+src="([^"]+)"')) {
      if ([IO.Path]::GetFileName($m.Groups[1].Value) -ne $need) { continue }
      $t = Join-Path $page.DirectoryName $m.Groups[1].Value
      if ((Test-Path -LiteralPath $t) -and ((Resolve-Path -LiteralPath $t).Path -eq (Join-Path $root $need))) { $ok = $true; break }
    }
    if (-not $ok) { $miss += $need }
  }
  if ($miss.Count) { $bad += ('{0}   缺少 {1}' -f $page.FullName.Substring($root.Length + 1), ($miss -join ' + ')) }
}

if ($bad.Count) {
  Write-Host '❌ 以下页面用到 window.DB，却没有显式引入数据层（线上会报 DB is not defined）：'
  $bad | ForEach-Object { Write-Host ('   ' + $_) }
  Write-Host '   修法：在该页 <script src="supabase-client.js"> 之前加 <script src="<相对路径>/config.js"></script> 和 github-db.js（public/ 用 ../，public/games/ 用 ../../）。'
  exit 1
}
Write-Host ('✅ 通过：{0} 个 HTML 中，所有用到 window.DB 的页面都显式引入了 config.js + github-db.js。' -f $pages.Count)
exit 0
