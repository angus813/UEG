// ========== 全局变量 ==========
const params = new URLSearchParams(window.location.search);
const mapId = params.get('id');
let currentMap = null;
let shapes = [];
let loadedShapesSnapshot = ''; // 加载时服务端 shapes 快照，用于保存前冲突比对

const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('canvasContainer');

const WORLD_MIN = 0;
const WORLD_MAX = 10000;

let scale = 1, offsetX = 0, offsetY = 0;

let currentTool = 'select';
let isDrawing = false, tempShape = null;
let selectedShapeIndex = -1;
let dragHandle = null, dragStartPos = null, dragStartShape = null;
let isMovingShape = false, moveStartPos = null, moveStartShapeBounds = null;
let textureImage = null;
let isPanning = false, lastScreen = { x: 0, y: 0 };
let longPressTimer = null;
let pointerDownPos = { x: 0, y: 0 };
let isLongPressPan = false;
let isPointerDown = false;

// 坐标定位光点
let targetMarker = null;
let targetMarkerTimer = null;

// 剪贴板
let clipboardShape = null;

// 只读模式
let isViewMode = false;

// 未保存更改标记（saveState 置 true，saveMap 成功置 false）
let dirty = false;

// ---------- 触摸缩放新增 ----------
let lastTouchDist = 0;
let isTouchPinch = false;

// ---------- 模板图形只读标记 ----------
let isGalaxyMode = false;

// ---------- 动画相关（敌情旋转） ----------
let gatherRotation = 0;           // 当前旋转角度（弧度）
let animationInterval = null;     // 定时器句柄

function startAnimation() {
  if (animationInterval) return;
  animationInterval = setInterval(() => {
    gatherRotation += 0.02;       // 每帧约 0.02 弧度（约 6 秒转一圈）
    redraw();
  }, 50);                         // 20 FPS
}

function stopAnimation() {
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }
}

// ---------- 当前用户 ----------
function getCurrentUser() {
  try {
    const cu = localStorage.getItem('ueg_current_user');
    return cu ? JSON.parse(cu) : null;
  } catch (e) {
    return null;
  }
}

// ---------- 撤回/回撤系统 ----------
const MAX_HISTORY = 50;
let history = [];
let historyIndex = -1;

function saveState() {
  if (isViewMode) return;
  dirty = true;
  history = history.slice(0, historyIndex + 1);
  const snapshot = JSON.parse(JSON.stringify(shapes));
  history.push(snapshot);
  if (history.length > MAX_HISTORY) history.shift();
  else historyIndex++;
}

function undo() {
  if (isViewMode || historyIndex <= 0) return;
  historyIndex--;
  dirty = true;
  shapes = JSON.parse(JSON.stringify(history[historyIndex]));
  selectedShapeIndex = -1;
  document.getElementById('propertiesSection').style.display = 'none';
  document.getElementById('textProps').style.display = 'none';
  redraw();
}

function redo() {
  if (isViewMode || historyIndex >= history.length - 1) return;
  historyIndex++;
  dirty = true;
  shapes = JSON.parse(JSON.stringify(history[historyIndex]));
  selectedShapeIndex = -1;
  document.getElementById('propertiesSection').style.display = 'none';
  document.getElementById('textProps').style.display = 'none';
  redraw();
}

function initHistory() {
  history = [];
  history.push(JSON.parse(JSON.stringify(shapes)));
  historyIndex = 0;
}

// ---------- 坐标转换 ----------
function toWorld(sx, sy) {
  return { x: offsetX + sx / scale, y: offsetY + (canvas.height - sy) / scale };
}
function toScreen(wx, wy) {
  return { x: (wx - offsetX) * scale, y: canvas.height - (wy - offsetY) * scale };
}

function clampOffset() {
  const ww = canvas.width / scale, hh = canvas.height / scale;
  if (ww > WORLD_MAX - WORLD_MIN) offsetX = (WORLD_MIN + WORLD_MAX - ww) / 2;
  else offsetX = Math.max(WORLD_MIN, Math.min(WORLD_MAX - ww, offsetX));
  if (hh > WORLD_MAX - WORLD_MIN) offsetY = (WORLD_MIN + WORLD_MAX - hh) / 2;
  else offsetY = Math.max(WORLD_MIN, Math.min(WORLD_MAX - hh, offsetY));
}

function clampScale(newScale) {
  const maxScale = Math.min(canvas.width / 10, canvas.height / 10);
  const minScale = Math.max(canvas.width / (WORLD_MAX - WORLD_MIN), canvas.height / (WORLD_MAX - WORLD_MIN));
  return Math.max(minScale, Math.min(maxScale, newScale));
}

// ---------- 包围盒 ----------
function getShapeBounds(shape) {
  const { type } = shape;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const addPoint = (x, y) => {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  };

  if (type === 'freehand' && Array.isArray(shape.points) && shape.points.length) {
    shape.points.forEach(pt => { if (pt) addPoint(pt.x, pt.y); });
  } else if (shape.x1 !== undefined && shape.x2 !== undefined) {
    addPoint(shape.x1, shape.y1);
    addPoint(shape.x2, shape.y2);
    if (type === 'arrow') {
      const headSize = 10;
      const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);
      addPoint(shape.x2 - headSize * Math.cos(angle - Math.PI / 6), shape.y2 - headSize * Math.sin(angle - Math.PI / 6));
      addPoint(shape.x2 - headSize * Math.cos(angle + Math.PI / 6), shape.y2 - headSize * Math.sin(angle + Math.PI / 6));
    }
  } else {
    addPoint(shape.x, shape.y);
    addPoint(shape.x + (shape.w || 0), shape.y + (shape.h || 0));
  }
  return { minX, minY, maxX, maxY };
}

function applyBoundsToShape(shape, minX, minY, maxX, maxY) {
  // freehand：整体平移 points 数组（不缩放点集）
  if (shape.type === 'freehand' && Array.isArray(shape.points) && shape.points.length) {
    const cur = getShapeBounds(shape);
    if (Number.isFinite(cur.minX) && Number.isFinite(cur.minY)) {
      const dx = minX - cur.minX;
      const dy = minY - cur.minY;
      shape.points.forEach(pt => { pt.x += dx; pt.y += dy; });
      shape.x = minX;
      shape.y = minY;
    }
    return;
  }
  const w = maxX - minX;
  const h = maxY - minY;
  if (shape.x1 !== undefined && shape.x2 !== undefined) {
    const oldMinX = Math.min(shape.x1, shape.x2);
    const oldMinY = Math.min(shape.y1, shape.y2);
    const oldMaxX = Math.max(shape.x1, shape.x2);
    const oldMaxY = Math.max(shape.y1, shape.y2);
    const scaleX = (oldMaxX !== oldMinX) ? w / (oldMaxX - oldMinX) : 1;
    const scaleY = (oldMaxY !== oldMinY) ? h / (oldMaxY - oldMinY) : 1;
    shape.x1 = minX + (shape.x1 - oldMinX) * scaleX;
    shape.y1 = minY + (shape.y1 - oldMinY) * scaleY;
    shape.x2 = minX + (shape.x2 - oldMinX) * scaleX;
    shape.y2 = minY + (shape.y2 - oldMinY) * scaleY;
  } else {
    shape.x = minX;
    shape.y = minY;
    shape.w = w;
    shape.h = h;
  }
}

// 用 points 重算 freehand 的 x/y/w/h 包围盒（min 为 x/y，宽高为 max-min，0 也保留）
function updateFreehandBounds(shape) {
  if (!shape || !Array.isArray(shape.points) || !shape.points.length) return;
  let mnX = Infinity, mnY = Infinity, mxX = -Infinity, mxY = -Infinity;
  shape.points.forEach(pt => {
    if (!pt) return;
    if (pt.x < mnX) mnX = pt.x;
    if (pt.y < mnY) mnY = pt.y;
    if (pt.x > mxX) mxX = pt.x;
    if (pt.y > mxY) mxY = pt.y;
  });
  shape.x = mnX;
  shape.y = mnY;
  shape.w = mxX - mnX;
  shape.h = mxY - mnY;
}

// ---------- 形状生成器 ----------
const ShapeGenerator = {
  getPath(shape) {
    const { type, x, y, w, h } = shape;
    const p = new Path2D();
    if (shape.x1 !== undefined && shape.x2 !== undefined) {
      const x1 = shape.x1, y1 = shape.y1, x2 = shape.x2, y2 = shape.y2;
      switch (type) {
        case 'line': p.moveTo(x1, y1); p.lineTo(x2, y2); break;
        case 'arrow':
          drawArrowHead(p, x1, y1, x2, y2, true);
          break;
        default: p.moveTo(x1, y1); p.lineTo(x2, y2);
      }
      return p;
    }
    if (type === 'text' || type === 'verticalText' || type === 'city' || type === 'frame' || type === 'brokenFrame' ||
        type === 'defenseLine' || type === 'target' || type === 'gather' || type === 'mine' || type === 'caution' || type === 'focus' || type === 'pin') {
      p.rect(x, y, w, h);
      return p;
    }
    const cx = x + w/2, cy = y + h/2;
    switch (type) {
      case 'rect': p.rect(x, y, w, h); break;
      case 'roundRect': drawRoundRect(p, x, y, w, h, shape.customProps?.radius || 15); break;
      case 'ellipse': p.ellipse(cx, cy, w/2, h/2, 0, 0, Math.PI*2); break;
      case 'triangle': drawTriangle(p, x, y, w, h); break;
      case 'rightTriangle': drawRightTriangle(p, x, y, w, h); break;
      case 'diamond': drawDiamond(p, x, y, w, h); break;
      case 'parallelogram': drawParallelogram(p, x, y, w, h); break;
      case 'trapezoid': drawTrapezoid(p, x, y, w, h); break;
      case 'pentagon': drawRegularPolygon(p, cx, cy, Math.min(w,h)/2, 5); break;
      case 'hexagon': drawRegularPolygon(p, cx, cy, Math.min(w,h)/2, 6); break;
      case 'star': drawStar(p, cx, cy, Math.min(w,h)/2, Math.min(w,h)/4, 5); break;
      case 'cross': drawCross(p, x, y, w, h); break;
      case 'plus': drawPlus(p, cx, cy, w/2, h/2); break;
      case 'freehand': if (shape.points && shape.points.length) { p.moveTo(shape.points[0].x, shape.points[0].y); shape.points.forEach(pt => p.lineTo(pt.x, pt.y)); } break;
      default: p.rect(x, y, w, h);
    }
    return p;
  }
};

// ---------- 辅助绘图函数 ----------
function drawArrowHead(p, x1, y1, x2, y2, withHead) {
  p.moveTo(x1, y1); p.lineTo(x2, y2);
  if (!withHead) return;
  const angle = Math.atan2(y2-y1, x2-x1);
  const size = 10;
  p.moveTo(x2, y2);
  p.lineTo(x2 - size*Math.cos(angle-Math.PI/6), y2 - size*Math.sin(angle-Math.PI/6));
  p.moveTo(x2, y2);
  p.lineTo(x2 - size*Math.cos(angle+Math.PI/6), y2 - size*Math.sin(angle+Math.PI/6));
}
function drawRoundRect(p, x,y,w,h,r) {
  p.moveTo(x+r, y); p.lineTo(x+w-r, y); p.arcTo(x+w, y, x+w, y+r, r);
  p.lineTo(x+w, y+h-r); p.arcTo(x+w, y+h, x+w-r, y+h, r);
  p.lineTo(x+r, y+h); p.arcTo(x, y+h, x, y+h-r, r);
  p.lineTo(x, y+r); p.arcTo(x, y, x+r, y, r); p.closePath();
}
function drawTriangle(p, x,y,w,h) { p.moveTo(x+w/2, y); p.lineTo(x+w, y+h); p.lineTo(x, y+h); p.closePath(); }
function drawRightTriangle(p, x,y,w,h) { p.moveTo(x, y); p.lineTo(x+w, y+h); p.lineTo(x, y+h); p.closePath(); }
function drawDiamond(p, x,y,w,h) { p.moveTo(x+w/2, y); p.lineTo(x+w, y+h/2); p.lineTo(x+w/2, y+h); p.lineTo(x, y+h/2); p.closePath(); }
function drawParallelogram(p, x,y,w,h) { p.moveTo(x+w*0.2, y); p.lineTo(x+w, y); p.lineTo(x+w*0.8, y+h); p.lineTo(x, y+h); p.closePath(); }
function drawTrapezoid(p, x,y,w,h) { const tw=w*0.6, dx=(w-tw)/2; p.moveTo(x+dx, y); p.lineTo(x+dx+tw, y); p.lineTo(x+w, y+h); p.lineTo(x, y+h); p.closePath(); }
function drawRegularPolygon(p, cx,cy,r, sides) { let ang=-Math.PI/2; p.moveTo(cx+r*Math.cos(ang), cy+r*Math.sin(ang)); for(let i=1;i<sides;i++){ ang+=2*Math.PI/sides; p.lineTo(cx+r*Math.cos(ang), cy+r*Math.sin(ang)); } p.closePath(); }
function drawStar(p, cx,cy,outerR,innerR,points) { let ang=-Math.PI/2; p.moveTo(cx+outerR*Math.cos(ang), cy+outerR*Math.sin(ang)); for(let i=0;i<points*2;i++){ let r=i%2===0? innerR: outerR; ang+=Math.PI/points; p.lineTo(cx+r*Math.cos(ang), cy+r*Math.sin(ang)); } p.closePath(); }
function drawCross(p, x,y,w,h) { p.moveTo(x+w*0.35, y); p.lineTo(x+w*0.65, y); p.lineTo(x+w*0.65, y+h*0.35); p.lineTo(x+w, y+h*0.35); p.lineTo(x+w, y+h*0.65); p.lineTo(x+w*0.65, y+h*0.65); p.lineTo(x+w*0.65, y+h); p.lineTo(x+w*0.35, y+h); p.lineTo(x+w*0.35, y+h*0.65); p.lineTo(x, y+h*0.65); p.lineTo(x, y+h*0.35); p.lineTo(x+w*0.35, y+h*0.35); p.closePath(); }
function drawPlus(p, cx,cy,armW,armH) { p.moveTo(cx-armW*0.3, cy-armH); p.lineTo(cx+armW*0.3, cy-armH); p.lineTo(cx+armW*0.3, cy-armW*0.3); p.lineTo(cx+armW, cy-armW*0.3); p.lineTo(cx+armW, cy+armW*0.3); p.lineTo(cx+armW*0.3, cy+armW*0.3); p.lineTo(cx+armW*0.3, cy+armH); p.lineTo(cx-armW*0.3, cy+armH); p.lineTo(cx-armW*0.3, cy+armW*0.3); p.lineTo(cx-armW, cy+armW*0.3); p.lineTo(cx-armW, cy-armW*0.3); p.lineTo(cx-armW*0.3, cy-armW*0.3); p.closePath(); }

// ---------- 空心弧 ----------
function drawArcShape(ctx, shape) {
  const { x, y, w, h, strokeColor, strokeWidth, opacity, startAngle = 0, endAngle = Math.PI } = shape;
  const cx = x + w/2, cy = y + h/2;
  const radiusX = w/2, radiusY = h/2;
  ctx.save();
  ctx.globalAlpha = opacity !== undefined ? opacity : 1;
  ctx.strokeStyle = strokeColor || '#ffffff';
  ctx.lineWidth = Math.max(1.5 / scale, (strokeWidth || 4) / scale);
  ctx.beginPath();
  ctx.ellipse(cx, cy, radiusX, radiusY, 0, startAngle, endAngle);
  ctx.stroke();
  ctx.restore();
}

// ---------- 城市 ----------
function drawCityShape(ctx, shape) {
  const { x, y, w, h, fillColor, strokeColor, opacity } = shape;
  const thickness = Math.max(w * 0.06, 1.5 / scale);
  const borderRect = { x, y, w, h };
  const holeRect = {
    x: x + thickness,
    y: y + thickness,
    w: w - 2 * thickness,
    h: h - 2 * thickness
  };
  const centerRect = {
    x: x + 2 * thickness,
    y: y + 2 * thickness,
    w: w - 4 * thickness,
    h: h - 4 * thickness
  };
  ctx.save();
  ctx.globalAlpha = opacity !== undefined ? opacity : 1;
  ctx.fillStyle = fillColor || '#ffcc00';
  ctx.beginPath();
  ctx.rect(borderRect.x, borderRect.y, borderRect.w, borderRect.h);
  ctx.rect(holeRect.x, holeRect.y, holeRect.w, holeRect.h);
  ctx.fill('evenodd');
  ctx.fillStyle = strokeColor || '#ffcc00';
  ctx.beginPath();
  ctx.rect(centerRect.x, centerRect.y, centerRect.w, centerRect.h);
  ctx.fill();
  ctx.restore();
}

// ---------- 边框 ----------
function drawFrameShape(ctx, shape) {
  const { x, y, w, h, strokeColor, strokeWidth, opacity } = shape;
  ctx.save();
  ctx.globalAlpha = opacity !== undefined ? opacity : 1;
  ctx.strokeStyle = strokeColor || '#ffcc00';
  ctx.lineWidth = Math.max(1.5 / scale, (strokeWidth || 4) / scale);
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.stroke();
  ctx.restore();
}

function drawBrokenFrameShape(ctx, shape) {
  const { x, y, w, h, strokeColor, strokeWidth, opacity } = shape;
  const gapSize = Math.min(w, h) * 0.2;
  const halfGap = gapSize / 2;
  const cx = x + w/2;
  const cy = y + h/2;
  ctx.save();
  ctx.globalAlpha = opacity !== undefined ? opacity : 1;
  ctx.strokeStyle = strokeColor || '#ffcc00';
  ctx.lineWidth = Math.max(1.5 / scale, (strokeWidth || 4) / scale);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, cy - halfGap);
  ctx.moveTo(x + w, cy + halfGap);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, cy + halfGap);
  ctx.moveTo(x, cy - halfGap);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.restore();
}

// ---------- 箭头距离 ----------
function drawArrowDistance(ctx, shape) {
  if (shape.type !== 'arrow' || shape.x1 === undefined) return;
  const x1 = shape.x1, y1 = shape.y1, x2 = shape.x2, y2 = shape.y2;
  const dist = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
  if (dist < 5) return;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const angle = Math.atan2(y2-y1, x2-x1);
  const offset = 20 / scale;
  const textX = midX + offset * Math.sin(angle);
  const textY = midY - offset * Math.cos(angle);
  const screen = toScreen(textX, textY);
  ctx.save();
  ctx.setTransform(1,0,0,1,0,0);
  ctx.fillStyle = '#ffffff';
  ctx.font = `${Math.max(10, 14 * scale)}px Rajdhani, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 4;
  ctx.fillText(Math.round(dist), screen.x, screen.y);
  ctx.restore();
}

// ---------- 可编辑性 ----------
function isShapeEditable(shape) {
  if (isGalaxyMode && shape.fromTemplate === true) return false;
  return true;
}

// ==================== 修正图形样式（固定大小，除以scale） ====================

// 防御线（水平线+垛口，固定像素大小）
function drawDefenseLine(ctx, shape) {
  const { x, y, w, h, strokeColor, opacity } = shape;
  const cy = y + h/2;
  const lineWidth = Math.max(2, (shape.strokeWidth || 2) / scale);
  const blockW = Math.max(4, 10 / scale);
  const blockH = Math.max(4, 12 / scale);
  const count = 8;
  const step = w / (count - 1);
  ctx.save();
  ctx.globalAlpha = opacity !== undefined ? opacity : 1;
  ctx.strokeStyle = strokeColor || '#ffffff';
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x + 4, cy);
  ctx.lineTo(x + w - 4, cy);
  ctx.stroke();
  for (let i = 0; i < count; i++) {
    const px = x + i * step;
    ctx.fillStyle = strokeColor || '#ffffff';
    ctx.fillRect(px - blockW/2, cy - blockH/2 - 2/scale, blockW, blockH/2);
    ctx.fillRect(px - blockW/4, cy - blockH/2 - 5/scale, blockW/2, 3/scale);
  }
  ctx.restore();
}

// 目标（外圆+中心点+四个倒三角指向中心，固定大小）
function drawTarget(ctx, shape) {
  const { x, y, w, h, strokeColor, opacity } = shape;
  const cx = x + w/2, cy = y + h/2;
  const r = Math.min(w, h) / 2 - 4;
  const lineWidth = Math.max(1.5, (shape.strokeWidth || 2) / scale);
  const triSize = Math.max(4, 10 / scale);
  const dotSize = Math.max(2, 4 / scale);
  ctx.save();
  ctx.globalAlpha = opacity !== undefined ? opacity : 1;
  ctx.strokeStyle = strokeColor || '#ffffff';
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = strokeColor || '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, dotSize, 0, Math.PI * 2);
  ctx.fill();
  const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  dirs.forEach(([dx, dy]) => {
    const px = cx + dx * (r - 4);
    const py = cy + dy * (r - 4);
    ctx.fillStyle = strokeColor || '#ffffff';
    ctx.beginPath();
    if (dx === 0 && dy === -1) {
      ctx.moveTo(px, py + triSize);
      ctx.lineTo(px - triSize, py - triSize);
      ctx.lineTo(px + triSize, py - triSize);
    } else if (dx === 1 && dy === 0) {
      ctx.moveTo(px - triSize, py);
      ctx.lineTo(px + triSize, py - triSize);
      ctx.lineTo(px + triSize, py + triSize);
    } else if (dx === 0 && dy === 1) {
      ctx.moveTo(px, py - triSize);
      ctx.lineTo(px - triSize, py + triSize);
      ctx.lineTo(px + triSize, py + triSize);
    } else {
      ctx.moveTo(px + triSize, py);
      ctx.lineTo(px - triSize, py - triSize);
      ctx.lineTo(px - triSize, py + triSize);
    }
    ctx.closePath();
    ctx.fill();
  });
  ctx.restore();
}

// ===== 敌情（三个弧形箭头循环，固定像素 + 旋转动画 + 箭头朝外 + 大小可调） =====
function drawGather(ctx, shape) {
  const { x, y, w, h, strokeColor, opacity } = shape;
  const cx = x + w/2, cy = y + h/2;

  const sizeFactor = Math.max(0.1, Math.min(w, h) / 100);
  const radius = 20 * sizeFactor / scale;
  const lineWidth = Math.max(1.5, (shape.strokeWidth || 2) * sizeFactor / scale);
  const headSize = Math.max(3, 6 * sizeFactor / scale);
  const dotSize = Math.max(2, 4 * sizeFactor / scale);

  ctx.save();
  ctx.globalAlpha = opacity !== undefined ? opacity : 1;
  // 使用红色调突出敌情（允许通过属性面板改色，保留默认红）
  ctx.strokeStyle = shape.strokeColor || '#ff3333';
  ctx.fillStyle = shape.fillColor || '#ff3333';
  ctx.lineWidth = lineWidth;

  const count = 3;
  const baseAngle = gatherRotation;

  for (let i = 0; i < count; i++) {
    const offset = i * 2 * Math.PI / count;
    const startA = baseAngle + offset - 0.5;
    const endA   = baseAngle + offset + 0.5;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, startA, endA);
    ctx.stroke();

    const tipX = cx + radius * Math.cos(endA);
    const tipY = cy + radius * Math.sin(endA);
    const tangentAngle = endA + Math.PI / 2;
    const baseOffset = headSize * 0.5;
    const baseX1 = tipX - baseOffset * Math.cos(tangentAngle);
    const baseY1 = tipY - baseOffset * Math.sin(tangentAngle);
    const baseX2 = tipX + baseOffset * Math.cos(tangentAngle);
    const baseY2 = tipY + baseOffset * Math.sin(tangentAngle);

    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(baseX1, baseY1);
    ctx.lineTo(baseX2, baseY2);
    ctx.closePath();
    ctx.fill();
  }

  // 中心红点
  ctx.beginPath();
  ctx.arc(cx, cy, dotSize, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 矿区（3D立方体，固定大小）
function drawMine(ctx, shape) {
  const { x, y, w, h, fillColor, strokeColor, opacity } = shape;
  const cx = x + w/2, cy = y + h/2;
  const pixelSize = 30 / scale;
  const lineWidth = Math.max(1.5, (shape.strokeWidth || 2) / scale);
  ctx.save();
  ctx.globalAlpha = opacity !== undefined ? opacity : 1;
  ctx.strokeStyle = strokeColor || '#ffffff';
  ctx.lineWidth = lineWidth;
  if (fillColor && fillColor !== 'none') {
    ctx.fillStyle = fillColor;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(cx - pixelSize, cy - pixelSize, pixelSize * 2, pixelSize * 2);
    ctx.globalAlpha = opacity !== undefined ? opacity : 1;
  }
  ctx.strokeRect(cx - pixelSize, cy - pixelSize, pixelSize * 2, pixelSize * 2);
  ctx.beginPath();
  ctx.moveTo(cx + pixelSize, cy - pixelSize);
  ctx.lineTo(cx + pixelSize + pixelSize * 0.5, cy - pixelSize - pixelSize * 0.3);
  ctx.lineTo(cx + pixelSize + pixelSize * 0.5, cy + pixelSize - pixelSize * 0.3);
  ctx.lineTo(cx + pixelSize, cy + pixelSize);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - pixelSize, cy - pixelSize);
  ctx.lineTo(cx - pixelSize + pixelSize * 0.5, cy - pixelSize - pixelSize * 0.3);
  ctx.lineTo(cx + pixelSize + pixelSize * 0.5, cy - pixelSize - pixelSize * 0.3);
  ctx.lineTo(cx + pixelSize, cy - pixelSize);
  ctx.stroke();
  ctx.restore();
}

// 注意（两个倒三角嵌套，固定大小）
function drawCaution(ctx, shape) {
  const { x, y, w, h, fillColor, strokeColor, opacity } = shape;
  const cx = x + w/2, cy = y + h/2;
  const pixelOuter = 20 / scale;
  const pixelInner = pixelOuter * 0.7;
  const lineWidth = Math.max(1.5, (shape.strokeWidth || 2) / scale);
  ctx.save();
  ctx.globalAlpha = opacity !== undefined ? opacity : 1;
  ctx.fillStyle = fillColor || '#ff4444';
  ctx.strokeStyle = strokeColor || '#ffffff';
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(cx, cy + pixelOuter);
  ctx.lineTo(cx - pixelOuter, cy - pixelOuter);
  ctx.lineTo(cx + pixelOuter, cy - pixelOuter);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#0a0c0f';
  ctx.beginPath();
  ctx.moveTo(cx, cy + pixelInner);
  ctx.lineTo(cx - pixelInner, cy - pixelInner);
  ctx.lineTo(cx + pixelInner, cy - pixelInner);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

// 重点（两个正菱形嵌套，固定大小）
function drawFocus(ctx, shape) {
  const { x, y, w, h, fillColor, strokeColor, opacity } = shape;
  const cx = x + w/2, cy = y + h/2;
  const pixelOuter = 20 / scale;
  const pixelInner = pixelOuter * 0.7;
  const lineWidth = Math.max(1.5, (shape.strokeWidth || 2) / scale);
  ctx.save();
  ctx.globalAlpha = opacity !== undefined ? opacity : 1;
  ctx.fillStyle = fillColor || '#ffaa00';
  ctx.strokeStyle = strokeColor || '#ffffff';
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(cx, cy - pixelOuter);
  ctx.lineTo(cx + pixelOuter, cy);
  ctx.lineTo(cx, cy + pixelOuter);
  ctx.lineTo(cx - pixelOuter, cy);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#0a0c0f';
  ctx.beginPath();
  ctx.moveTo(cx, cy - pixelInner);
  ctx.lineTo(cx + pixelInner, cy);
  ctx.lineTo(cx, cy + pixelInner);
  ctx.lineTo(cx - pixelInner, cy);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

// 标记针（正方形+垂直线，固定大小）
function drawPin(ctx, shape) {
  const { x, y, w, h, fillColor, strokeColor, opacity } = shape;
  const cx = x + w/2, cy = y + h/2;
  const pixelSize = 15 / scale;
  const lineWidth = Math.max(1.5, (shape.strokeWidth || 2) / scale);
  ctx.save();
  ctx.globalAlpha = opacity !== undefined ? opacity : 1;
  ctx.fillStyle = fillColor || '#66dd88';
  ctx.strokeStyle = strokeColor || '#ffffff';
  ctx.lineWidth = lineWidth;
  const sqSize = pixelSize * 1.2;
  ctx.fillRect(cx - sqSize/2, cy - sqSize, sqSize, sqSize);
  ctx.strokeRect(cx - sqSize/2, cy - sqSize, sqSize, sqSize);
  ctx.beginPath();
  ctx.moveTo(cx, cy + 2);
  ctx.lineTo(cx, cy + h/2 - 2);
  ctx.stroke();
  ctx.restore();
}

// ---------- 判断是否可以删除 ----------
function canDeleteShape(shape) {
  if (shape.fromTemplate === true) return false;
  const user = getCurrentUser();
  if (!user) return false;
  if (user.is_admin === true || user.isAdmin === true) return true;
  return shape.creator === user.username;
}

// ---------- 形状预设（根据地图类型动态生成） ----------
function getShapePresets() {
  const base = [
    { category: '矩形', shapes: [{ type: 'rect', name: '矩形' }, { type: 'roundRect', name: '圆角矩形' }] },
    { category: '基本形状', shapes: [
      { type: 'ellipse', name: '椭圆' }, { type: 'triangle', name: '等腰三角' }, { type: 'rightTriangle', name: '直角三角' },
      { type: 'diamond', name: '菱形' }, { type: 'parallelogram', name: '平行四边形' }, { type: 'trapezoid', name: '梯形' },
      { type: 'pentagon', name: '正五边形' }, { type: 'hexagon', name: '六边形' }, { type: 'star', name: '星形' },
      { type: 'cross', name: '十字形' }, { type: 'plus', name: '加号' },
      { type: 'arc', name: '空心弧' },
      { type: 'text', name: '文本框' }
    ]},
    { category: '箭头', shapes: [
      { type: 'arrow', name: '箭头' }
    ]}
  ];
  if (isGalaxyMode) {
    base.push({
      category: '标记',
      shapes: [
        { type: 'defenseLine', name: '防御线' },
        { type: 'target', name: '目标' },
        // <-- 改动：将 '集合' 改为 '敌情'
        { type: 'gather', name: '敌情' },
        { type: 'mine', name: '矿区' },
        { type: 'caution', name: '注意' },
        { type: 'focus', name: '重点' },
        { type: 'pin', name: '标记针' }
      ]
    });
  } else {
    base.push({
      category: '设施',
      shapes: [
        { type: 'city', name: '城市' },
        { type: 'frame', name: '方形边框' },
        { type: 'brokenFrame', name: '断开方框' }
      ]
    });
  }
  return base;
}

// ---------- 工具栏按钮创建 ----------
const toolbar = document.getElementById('toolbar');
function createShapeButtons() {
  if (isViewMode) return;
  const presets = getShapePresets();
  presets.forEach(cat => {
    const section = document.createElement('div'); section.className = 'tool-section';
    section.innerHTML = `<div class="section-title" data-collapse="${cat.category}">${cat.category}</div><div class="section-content collapsed"></div>`;
    const content = section.querySelector('.section-content');
    cat.shapes.forEach(s => {
      const btn = document.createElement('button'); btn.className = 'shape-btn'; btn.title = s.name;
      const iconCanvas = document.createElement('canvas'); iconCanvas.width=32; iconCanvas.height=32;
      const ictx = iconCanvas.getContext('2d');
      ictx.fillStyle = '#00c8ff'; ictx.strokeStyle = '#ffffff'; ictx.lineWidth = 1.5;
      drawShapeIcon(ictx, s.type, 4,4,24,24);
      btn.appendChild(iconCanvas);
      btn.addEventListener('click', () => {
        const center = toWorld(canvas.width/2, canvas.height/2);
        let newShape;
        if (s.type === 'arrow') {
          newShape = createShape('arrow', 0, 0, 0, 0, { x1: center.x-50, y1: center.y-50, x2: center.x+50, y2: center.y+50 });
        } else if (s.type === 'text') {
          newShape = createShape('text', center.x-80, center.y-25, 160, 50, {
            text: '双击编辑',
            fontSize: 20,
            fill: 'none',
            strokeColor: '#ffffff',
            strokeWidth: 0
          });
        } else {
          newShape = createShape(s.type, Math.max(0, center.x-50), Math.max(0, center.y-50), 100, 100);
        }
        shapes.push(newShape);
        saveState();
        redraw();
      });
      content.appendChild(btn);
    });
    toolbar.insertBefore(section, document.getElementById('propertiesSection'));
  });
}

// ---------- 绘制工具栏图标（固定32x32，无需调整） ----------
function drawShapeIcon(ictx, type, x, y, w, h) {
  const shape = { type, x, y, w, h };
  if (type === 'arrow') {
    shape.x1 = x; shape.y1 = y; shape.x2 = x+w; shape.y2 = y+h;
  } else if (type === 'text') {
    shape.text = 'T'; shape.fontSize = 12;
  }

  // 特殊图形
  if (type === 'city') {
    const ctxIcon = ictx;
    ctxIcon.save();
    const baseColor = '#ffcc00';
    const innerColor = '#ffcc00';
    const thick = 2;
    ctxIcon.fillStyle = baseColor;
    ctxIcon.beginPath();
    ctxIcon.rect(x, y, w, h);
    ctxIcon.rect(x + thick, y + thick, w - 2*thick, h - 2*thick);
    ctxIcon.fill('evenodd');
    ctxIcon.fillStyle = innerColor;
    ctxIcon.fillRect(x + 2*thick, y + 2*thick, w - 4*thick, h - 4*thick);
    ctxIcon.restore();
    return;
  }
  if (type === 'frame') {
    ictx.strokeStyle = '#ffcc00';
    ictx.lineWidth = 2;
    ictx.strokeRect(x+2, y+2, w-4, h-4);
    return;
  }
  if (type === 'brokenFrame') {
    const gap = 4;
    const cy = y + h/2;
    ictx.strokeStyle = '#ffcc00';
    ictx.lineWidth = 2;
    ictx.beginPath();
    ictx.moveTo(x+2, y+2);
    ictx.lineTo(x+w-2, y+2);
    ictx.lineTo(x+w-2, cy - gap);
    ictx.moveTo(x+w-2, cy + gap);
    ictx.lineTo(x+w-2, y+h-2);
    ictx.lineTo(x+2, y+h-2);
    ictx.lineTo(x+2, cy + gap);
    ictx.moveTo(x+2, cy - gap);
    ictx.lineTo(x+2, y+2);
    ictx.stroke();
    return;
  }
  if (type === 'arc') {
    ictx.strokeStyle = '#ffffff';
    ictx.lineWidth = 2.5;
    ictx.beginPath();
    ictx.ellipse(x+w/2, y+h/2, w/2-2, h/2-2, 0, 0, Math.PI);
    ictx.stroke();
    return;
  }
  if (type === 'text') {
    ictx.fillStyle = '#ffffff';
    ictx.font = '12px Rajdhani, sans-serif';
    ictx.textAlign = 'center';
    ictx.textBaseline = 'middle';
    ictx.fillText('T', x + w/2, y + h/2);
    return;
  }

  // 标记图形（固定图标，使用像素值）
  if (type === 'defenseLine') {
    const cx = x + w/2, cy = y + h/2;
    ictx.strokeStyle = '#ffffff';
    ictx.lineWidth = 1.5;
    ictx.beginPath();
    ictx.moveTo(x+2, cy);
    ictx.lineTo(x+w-2, cy);
    ictx.stroke();
    const count = 5;
    for (let i = 0; i < count; i++) {
      const px = x + 2 + (w-4) * (i / (count-1));
      ictx.fillStyle = '#00c8ff';
      ictx.fillRect(px-2, cy-5, 4, 5);
      ictx.fillRect(px-1, cy-8, 2, 8);
    }
    return;
  }
  if (type === 'target') {
    const cx = x + w/2, cy = y + h/2;
    const r = Math.min(w,h)/2 - 2;
    ictx.strokeStyle = '#ffffff';
    ictx.lineWidth = 1.5;
    ictx.beginPath();
    ictx.arc(cx, cy, r, 0, Math.PI*2);
    ictx.stroke();
    ictx.fillStyle = '#ffffff';
    ictx.beginPath();
    ictx.arc(cx, cy, 1.5, 0, Math.PI*2);
    ictx.fill();
    const dirs = [[0,-1],[1,0],[0,1],[-1,0]];
    const size = 4;
    dirs.forEach(([dx, dy]) => {
      const px = cx + dx * (r - 3);
      const py = cy + dy * (r - 3);
      ictx.fillStyle = '#00c8ff';
      ictx.beginPath();
      if (dx === 0 && dy === -1) {
        ictx.moveTo(px, py + size);
        ictx.lineTo(px - size, py - size);
        ictx.lineTo(px + size, py - size);
      } else if (dx === 1 && dy === 0) {
        ictx.moveTo(px - size, py);
        ictx.lineTo(px + size, py - size);
        ictx.lineTo(px + size, py + size);
      } else if (dx === 0 && dy === 1) {
        ictx.moveTo(px, py - size);
        ictx.lineTo(px - size, py + size);
        ictx.lineTo(px + size, py + size);
      } else {
        ictx.moveTo(px + size, py);
        ictx.lineTo(px - size, py - size);
        ictx.lineTo(px - size, py + size);
      }
      ictx.closePath();
      ictx.fill();
    });
    return;
  }
  if (type === 'gather') {
    const cx = x + w/2, cy = y + h/2;
    const r = Math.min(w,h)/2 - 2;
    ictx.strokeStyle = '#ff3333';   // 红色调敌情
    ictx.fillStyle = '#ff3333';
    ictx.lineWidth = 2;
    const count = 3;
    for (let i = 0; i < count; i++) {
      const angle = i * 2*Math.PI/count - Math.PI/2;
      const startA = angle - 0.5;
      const endA = angle + 0.5;
      ictx.beginPath();
      ictx.arc(cx, cy, r, startA, endA);
      ictx.stroke();
      const endX = cx + r * Math.cos(endA);
      const endY = cy + r * Math.sin(endA);
      const ang = endA + Math.PI/2;
      const headSize = 3;
      ictx.beginPath();
      ictx.moveTo(endX, endY);
      ictx.lineTo(endX + headSize*Math.cos(ang-0.5), endY + headSize*Math.sin(ang-0.5));
      ictx.lineTo(endX + headSize*Math.cos(ang+0.5), endY + headSize*Math.sin(ang+0.5));
      ictx.closePath();
      ictx.fill();
    }
    return;
  }
  if (type === 'mine') {
    const cx = x + w/2, cy = y + h/2;
    const size = Math.min(w,h) * 0.3;
    ictx.strokeStyle = '#ffffff';
    ictx.lineWidth = 1.5;
    ictx.strokeRect(cx - size, cy - size, size*2, size*2);
    ictx.beginPath();
    ictx.moveTo(cx + size, cy - size);
    ictx.lineTo(cx + size + size*0.5, cy - size - size*0.3);
    ictx.lineTo(cx + size + size*0.5, cy + size - size*0.3);
    ictx.lineTo(cx + size, cy + size);
    ictx.stroke();
    ictx.beginPath();
    ictx.moveTo(cx - size, cy - size);
    ictx.lineTo(cx - size + size*0.5, cy - size - size*0.3);
    ictx.lineTo(cx + size + size*0.5, cy - size - size*0.3);
    ictx.lineTo(cx + size, cy - size);
    ictx.stroke();
    return;
  }
  if (type === 'caution') {
    const cx = x + w/2, cy = y + h/2;
    const outer = Math.min(w,h)/2 - 2;
    const inner = outer * 0.7;
    ictx.fillStyle = '#ff4444';
    ictx.strokeStyle = '#ffffff';
    ictx.lineWidth = 1.5;
    ictx.beginPath();
    ictx.moveTo(cx, cy + outer);
    ictx.lineTo(cx - outer, cy - outer);
    ictx.lineTo(cx + outer, cy - outer);
    ictx.closePath();
    ictx.fill();
    ictx.stroke();
    ictx.fillStyle = '#0a0c0f';
    ictx.beginPath();
    ictx.moveTo(cx, cy + inner);
    ictx.lineTo(cx - inner, cy - inner);
    ictx.lineTo(cx + inner, cy - inner);
    ictx.closePath();
    ictx.fill();
    ictx.stroke();
    return;
  }
  if (type === 'focus') {
    const cx = x + w/2, cy = y + h/2;
    const outer = Math.min(w,h)/2 * 0.6;
    const inner = outer * 0.7;
    ictx.fillStyle = '#ffaa00';
    ictx.strokeStyle = '#ffffff';
    ictx.lineWidth = 1.5;
    ictx.beginPath();
    ictx.moveTo(cx, cy - outer);
    ictx.lineTo(cx + outer, cy);
    ictx.lineTo(cx, cy + outer);
    ictx.lineTo(cx - outer, cy);
    ictx.closePath();
    ictx.fill();
    ictx.stroke();
    ictx.fillStyle = '#0a0c0f';
    ictx.beginPath();
    ictx.moveTo(cx, cy - inner);
    ictx.lineTo(cx + inner, cy);
    ictx.lineTo(cx, cy + inner);
    ictx.lineTo(cx - inner, cy);
    ictx.closePath();
    ictx.fill();
    ictx.stroke();
    return;
  }
  if (type === 'pin') {
    const cx = x + w/2, cy = y + h/2;
    const size = 7;
    ictx.fillStyle = '#66dd88';
    ictx.strokeStyle = '#ffffff';
    ictx.lineWidth = 1.5;
    ictx.fillRect(cx - size/2, cy - size, size, size);
    ictx.strokeRect(cx - size/2, cy - size, size, size);
    ictx.beginPath();
    ictx.moveTo(cx, cy + 2);
    ictx.lineTo(cx, cy + h/2);
    ictx.stroke();
    return;
  }

  // 其他通用形状
  const p = ShapeGenerator.getPath(shape);
  ictx.fill(p); ictx.stroke(p);
}

// ---------- 创建形状对象 ----------
function createShape(type, x, y, w, h, props={}) {
  const user = getCurrentUser();
  const defaults = {
    type, x, y, w: (w === undefined ? 100 : w), h: (h === undefined ? 100 : h), rotation:0,
    fill: 'solid', fillColor: '#00c8ff', strokeColor: '#ffffff', strokeWidth: 2, opacity: 1,
    text: '文本', fontSize: 20,
    fromTemplate: false,
    creator: user ? user.username : '未知',
    remark: ''
  };
  if (type === 'text' || type === 'verticalText') {
    defaults.fill = 'none';
    defaults.strokeWidth = 0;
  }
  if (type === 'city') {
    defaults.fillColor = '#ffcc00';
    defaults.strokeColor = '#ffcc00';
    defaults.w = 120;
    defaults.h = 120;
  }
  if (type === 'frame' || type === 'brokenFrame') {
    defaults.fill = 'none';
    defaults.strokeColor = '#ffcc00';
    defaults.strokeWidth = 4;
  }
  if (type === 'arc') {
    defaults.fill = 'none';
    defaults.strokeColor = '#ffffff';
    defaults.strokeWidth = 4;
  }
  if (type === 'arrow') {
    defaults.x1 = x;
    defaults.y1 = y;
    defaults.x2 = x + w;
    defaults.y2 = y + h;
    defaults.strokeColor = '#ffffff';
    defaults.strokeWidth = 2;
    defaults.fill = 'none';
  }
  // 标记图形默认颜色
  if (['defenseLine', 'target', 'gather', 'mine', 'caution', 'focus', 'pin'].includes(type)) {
    defaults.fill = 'solid';
    defaults.strokeColor = '#ffffff';
    defaults.strokeWidth = 1.5;
    if (type === 'target') defaults.fillColor = '#ff6a00';
    else if (type === 'gather') defaults.fillColor = '#ff3333';   // 敌情用红色
    else if (type === 'mine') defaults.fillColor = '#ffaa44';
    else if (type === 'caution') defaults.fillColor = '#ff4444';
    else if (type === 'focus') defaults.fillColor = '#ffaa00';
    else if (type === 'pin') defaults.fillColor = '#66dd88';
    else if (type === 'defenseLine') defaults.fillColor = '#88aacc';
  }
  return Object.assign(defaults, props);
}
// ========== 下半部分：复制粘贴、定位、渲染、事件、Supabase交互 ==========

// ---------- 复制粘贴功能 ----------
function copyShape() {
  if (isViewMode) return;
  if (selectedShapeIndex === -1) {
    alert('请先选择一个形状');
    return;
  }
  const shape = shapes[selectedShapeIndex];
  if (!isShapeEditable(shape)) {
    alert('当前选中的图形为模板图形，不可复制');
    return;
  }
  clipboardShape = JSON.parse(JSON.stringify(shape));
}

function pasteShape() {
  if (isViewMode) return;
  if (!clipboardShape) {
    alert('剪贴板为空，请先复制一个形状');
    return;
  }
  const newShape = JSON.parse(JSON.stringify(clipboardShape));
  newShape.fromTemplate = false;
  const offset = 50;
  if (newShape.x1 !== undefined) {
    newShape.x1 += offset;
    newShape.y1 += offset;
    newShape.x2 += offset;
    newShape.y2 += offset;
    if (newShape.x !== undefined) {
      newShape.x += offset;
      newShape.y += offset;
    }
  } else {
    newShape.x += offset;
    newShape.y += offset;
    if (Array.isArray(newShape.points)) {
      newShape.points.forEach(pt => { pt.x += offset; pt.y += offset; });
    }
  }
  shapes.push(newShape);
  selectedShapeIndex = shapes.length - 1;
  document.getElementById('propertiesSection').style.display = 'block';
  loadShapeProperties(newShape);
  saveState();
  redraw();
}

// ---------- 坐标定位 ----------
function locateToPoint(worldX, worldY) {
  worldX = Math.max(WORLD_MIN, Math.min(WORLD_MAX, worldX));
  worldY = Math.max(WORLD_MIN, Math.min(WORLD_MAX, worldY));
  offsetX = worldX - canvas.width / (2 * scale);
  offsetY = worldY - canvas.height / (2 * scale);
  clampOffset();
  targetMarker = { worldX, worldY, startTime: Date.now(), duration: 10000 };
  // 到期主动清除并重绘（多次定位时先清理旧定时器）
  if (targetMarkerTimer) clearTimeout(targetMarkerTimer);
  targetMarkerTimer = setTimeout(() => {
    targetMarker = null;
    targetMarkerTimer = null;
    redraw();
  }, 10000);
  redraw();
}

// ---------- 画布尺寸自适应 ----------
function resizeCanvas() {
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  if (!currentMap) {
    scale = Math.min(canvas.width / (WORLD_MAX - WORLD_MIN), canvas.height / (WORLD_MAX - WORLD_MIN));
    offsetX = 5000 - canvas.width / (2 * scale);
    offsetY = 5000 - canvas.height / (2 * scale);
  }
  clampOffset();
  redraw();
}
window.addEventListener('resize', resizeCanvas);

// ---------- 加载后按所有形状包围盒适配视野（无形状时默认居中） ----------
function fitToShapes() {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  shapes.forEach(s => {
    if (!s || typeof s.type !== 'string') return;
    const b = getShapeBounds(s);
    if (!Number.isFinite(b.minX) || !Number.isFinite(b.maxX) ||
        !Number.isFinite(b.minY) || !Number.isFinite(b.maxY)) return;
    if (b.minX < minX) minX = b.minX;
    if (b.minY < minY) minY = b.minY;
    if (b.maxX > maxX) maxX = b.maxX;
    if (b.maxY > maxY) maxY = b.maxY;
  });
  if (!Number.isFinite(minX) || minX >= maxX || minY >= maxY) {
    scale = Math.min(canvas.width / (WORLD_MAX - WORLD_MIN), canvas.height / (WORLD_MAX - WORLD_MIN));
    offsetX = 5000 - canvas.width / (2 * scale);
    offsetY = 5000 - canvas.height / (2 * scale);
    clampOffset();
    return;
  }
  const pad = 50;
  scale = clampScale(Math.min(canvas.width / (maxX - minX + pad * 2), canvas.height / (maxY - minY + pad * 2)));
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  offsetX = cx - canvas.width / (2 * scale);
  offsetY = cy - canvas.height / (2 * scale);
  clampOffset();
}

// ---------- 绘制用户名+备注标签 ----------
function drawShapeLabel(ctx, shape) {
  if (shape.fromTemplate === true) return;
  const label = shape.creator || '';
  const remark = shape.remark || '';
  if (!label && !remark) return;
  const text = label + (remark ? ': ' + remark : '');
  if (text.length === 0) return;
  const bounds = getShapeBounds(shape);
  const screen = toScreen(bounds.maxX + 5, bounds.minY - 5);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const fontSize = Math.max(8, 11 * scale);
  ctx.font = `${fontSize}px Rajdhani, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  const metrics = ctx.measureText(text);
  const pad = 4;
  const w = metrics.width + pad * 2;
  const h = fontSize + pad * 2;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 6;
  ctx.fillRect(screen.x - pad, screen.y - h, w, h);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, screen.x, screen.y - pad);
  ctx.restore();
}

// ---------- 主渲染函数 ----------
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(0, canvas.height);
  ctx.scale(1, -1);
  ctx.translate(-offsetX * scale, -offsetY * scale);
  ctx.scale(scale, scale);

  // 网格
  ctx.strokeStyle = '#3a5060';
  ctx.lineWidth = 0.8 / scale;
  const step = 100;
  const startX = Math.max(WORLD_MIN, Math.floor(offsetX / step) * step);
  const startY = Math.max(WORLD_MIN, Math.floor(offsetY / step) * step);
  const endX = Math.min(WORLD_MAX, offsetX + canvas.width / scale);
  const endY = Math.min(WORLD_MAX, offsetY + canvas.height / scale);
  for (let x = startX; x <= endX; x += step) {
    ctx.beginPath(); ctx.moveTo(x, startY); ctx.lineTo(x, endY); ctx.stroke();
  }
  for (let y = startY; y <= endY; y += step) {
    ctx.beginPath(); ctx.moveTo(startX, y); ctx.lineTo(endX, y); ctx.stroke();
  }

  // 坐标轴
  ctx.strokeStyle = '#2a5060'; ctx.lineWidth = 1.5 / scale;
  if (0 >= startX && 0 <= endX) {
    ctx.beginPath(); ctx.moveTo(Math.max(0, startX), 0); ctx.lineTo(Math.min(WORLD_MAX, endX), 0); ctx.stroke();
  }
  if (0 >= startY && 0 <= endY) {
    ctx.beginPath(); ctx.moveTo(0, Math.max(0, startY)); ctx.lineTo(0, Math.min(WORLD_MAX, endY)); ctx.stroke();
  }

  // 绘制所有形状
  shapes.forEach((shape, index) => {
    // 单个损坏形状不能拖垮整体渲染
    if (!shape || typeof shape.type !== 'string') return;
    const isText = (shape.type === 'text' || shape.type === 'verticalText');
    const isCity = (shape.type === 'city');
    const isFrame = (shape.type === 'frame');
    const isBrokenFrame = (shape.type === 'brokenFrame');
    const isArc = (shape.type === 'arc');
    const isDefense = shape.type === 'defenseLine';
    const isTarget = shape.type === 'target';
    const isGather = shape.type === 'gather';
    const isMine = shape.type === 'mine';
    const isCaution = shape.type === 'caution';
    const isFocus = shape.type === 'focus';
    const isPin = shape.type === 'pin';

    ctx.save();
    const bounds = getShapeBounds(shape);
    const cx = (bounds.minX + bounds.maxX) / 2;
    const cy = (bounds.minY + bounds.maxY) / 2;
    if (shape.rotation) {
      ctx.translate(cx, cy);
      ctx.rotate(shape.rotation);
      ctx.translate(-cx, -cy);
    }

    // 特殊标记图形（固定屏幕像素大小）
    if (isDefense) {
      drawDefenseLine(ctx, shape);
    } else if (isTarget) {
      drawTarget(ctx, shape);
    } else if (isGather) {
      drawGather(ctx, shape);
    } else if (isMine) {
      drawMine(ctx, shape);
    } else if (isCaution) {
      drawCaution(ctx, shape);
    } else if (isFocus) {
      drawFocus(ctx, shape);
    } else if (isPin) {
      drawPin(ctx, shape);
    } else {
      // 通用形状（随缩放变化）
      const path = ShapeGenerator.getPath(shape);
      ctx.globalAlpha = shape.opacity !== undefined ? shape.opacity : 1;
      if (shape.fill !== 'none' && !isText && !isFrame && !isBrokenFrame && !isArc) {
        if (shape.fill === 'solid') ctx.fillStyle = shape.fillColor || '#00c8ff';
        else if (shape.fill === 'linear' || shape.fill === 'radial') {
          const grad = shape.fill === 'linear' ?
            ctx.createLinearGradient(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY) :
            ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY)/2);
          grad.addColorStop(0, shape.fillColor); grad.addColorStop(1, shape.fillColor2 || '#000000');
          ctx.fillStyle = grad;
        } else if (shape.fill === 'texture') ctx.fillStyle = textureImage ? ctx.createPattern(textureImage, 'repeat') : '#8a8a8a';
        if (isCity) drawCityShape(ctx, shape);
        else ctx.fill(path);
      } else if (isText && shape.fill !== 'none') {
        ctx.fillStyle = shape.fillColor || '#00c8ff';
        ctx.fill(path);
      }

      // 描边
      if (isCity) {
        // 已绘制
      } else if (isFrame) {
        drawFrameShape(ctx, shape);
      } else if (isBrokenFrame) {
        drawBrokenFrameShape(ctx, shape);
      } else if (isArc) {
        drawArcShape(ctx, shape);
      } else {
        ctx.globalAlpha = 1;
        if (!isText) {
          ctx.strokeStyle = shape.strokeColor || '#ffffff';
          ctx.lineWidth = Math.max(1.5 / scale, (shape.strokeWidth || 2) / scale);
          ctx.stroke(path);
        }
      }
    }
    ctx.restore();

    // 文本绘制
    if (isText && shape.text) drawTextOnCanvas(shape);
    // 箭头距离
    if (shape.type === 'arrow') drawArrowDistance(ctx, shape);
    // 选中手柄（仅可编辑图形）
    if (!isViewMode && index === selectedShapeIndex && isShapeEditable(shape)) {
      drawSelectionHandles(shape);
    }
    // 用户名+备注标签
    drawShapeLabel(ctx, shape);
  });

  // 中心红点
  const redDotRadius = 5;
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#ff3333';
  ctx.beginPath(); ctx.arc(5000, 5000, redDotRadius, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1 / scale; ctx.stroke();

  // 定位光点
  if (targetMarker) {
    const elapsed = Date.now() - targetMarker.startTime;
    if (elapsed < targetMarker.duration) {
      const pulse = Math.abs(Math.sin(elapsed * 0.01));
      const alpha = 0.3 + pulse * 0.7;
      ctx.save(); ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffff00';
      ctx.beginPath(); ctx.arc(targetMarker.worldX, targetMarker.worldY, 8, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffaa00';
      ctx.beginPath(); ctx.arc(targetMarker.worldX, targetMarker.worldY, 4, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1 / scale; ctx.stroke();
      ctx.restore();
    } else targetMarker = null;
  }

  ctx.restore();
}

// ---------- 文本绘制辅助 ----------
function drawTextOnCanvas(shape) {
  const { x, y, w, h, text, fontSize, rotation } = shape;
  const cx = x + w/2, cy = y + h/2;
  const corners = [
    { x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }
  ].map(c => {
    let wx = c.x, wy = c.y;
    if (rotation) {
      const cos = Math.cos(rotation), sin = Math.sin(rotation);
      const dx = c.x - cx, dy = c.y - cy;
      wx = cx + dx * cos - dy * sin; wy = cy + dx * sin + dy * cos;
    }
    return toScreen(wx, wy);
  });
  const minScreenX = Math.min(...corners.map(c => c.x));
  const minScreenY = Math.min(...corners.map(c => c.y));
  const maxScreenX = Math.max(...corners.map(c => c.x));
  const maxScreenY = Math.max(...corners.map(c => c.y));
  const centerScreenX = (minScreenX + maxScreenX) / 2;
  const centerScreenY = (minScreenY + maxScreenY) / 2;

  ctx.save(); ctx.setTransform(1,0,0,1,0,0);
  ctx.globalAlpha = shape.opacity !== undefined ? shape.opacity : 1;
  const fontSizePixel = Math.max(8, (fontSize || 20) * scale);
  ctx.font = `${fontSizePixel}px Rajdhani, sans-serif`;
  ctx.fillStyle = shape.fillColor || '#ffffff';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.translate(centerScreenX, centerScreenY);
  if (shape.type === 'verticalText') {
    ctx.rotate(-(rotation || 0)); ctx.rotate(-Math.PI/2);
    ctx.fillText(text, 0, 0);
  } else {
    ctx.rotate(-(rotation || 0));
    ctx.fillText(text, 0, 0);
  }
  ctx.restore();
}

// ---------- 选中手柄 ----------
function drawSelectionHandles(shape) {
  if (isViewMode) return;
  const bounds = getShapeBounds(shape);
  if (bounds.minX === Infinity) return;
  const { minX, minY, maxX, maxY } = bounds;
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const rotation = shape.rotation || 0;
  const corners = [
    { x: minX, y: maxY }, { x: maxX, y: maxY }, { x: maxX, y: minY }, { x: minX, y: minY }
  ].map(c => {
    let wx = c.x, wy = c.y;
    if (rotation) {
      const cos = Math.cos(rotation), sin = Math.sin(rotation);
      const dx = c.x - cx, dy = c.y - cy;
      wx = cx + dx * cos - dy * sin; wy = cy + dx * sin + dy * cos;
    }
    return toScreen(wx, wy);
  });
  const handles = [
    {type:'tl', x:minX, y:maxY}, {type:'tr', x:maxX, y:maxY}, {type:'br', x:maxX, y:minY}, {type:'bl', x:minX, y:minY},
    {type:'tm', x:cx, y:maxY}, {type:'bm', x:cx, y:minY}, {type:'lm', x:minX, y:cy}, {type:'rm', x:maxX, y:cy},
    {type:'rot', x:cx, y:maxY + 20}
  ].map(h => {
    let wx = h.x, wy = h.y;
    if (rotation) {
      const cos = Math.cos(rotation), sin = Math.sin(rotation);
      const dx = h.x - cx, dy = h.y - cy;
      wx = cx + dx * cos - dy * sin; wy = cy + dx * sin + dy * cos;
    }
    const screen = toScreen(wx, wy);
    return {...h, screenX: screen.x, screenY: screen.y};
  });
  const screenCorners = corners;

  ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.globalAlpha = 1;
  ctx.setLineDash([5,3]); ctx.strokeStyle = '#00a3ff'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(screenCorners[0].x, screenCorners[0].y);
  for(let i=1;i<screenCorners.length;i++) ctx.lineTo(screenCorners[i].x, screenCorners[i].y);
  ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
  const tm = handles.find(h=>h.type==='tm'), rot = handles.find(h=>h.type==='rot');
  if(tm && rot) { ctx.beginPath(); ctx.moveTo(tm.screenX, tm.screenY); ctx.lineTo(rot.screenX, rot.screenY); ctx.strokeStyle='#00a3ff'; ctx.lineWidth=1.5; ctx.stroke(); }
  handles.forEach(h=>{
    const radius = h.type==='rot'?6:4;
    ctx.beginPath(); ctx.arc(h.screenX, h.screenY, radius, 0, Math.PI*2);
    ctx.fillStyle = h.type==='rot'?'#00a3ff':'#ffffff'; ctx.fill();
    ctx.strokeStyle='#000'; ctx.lineWidth=1; ctx.stroke();
  });
  ctx.restore();
}

// ========== 事件处理（含触摸缩放） ==========
function getEventPos(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return { x: clientX - rect.left, y: clientY - rect.top };
}
function clearLongPress() { if(longPressTimer){ clearTimeout(longPressTimer); longPressTimer=null; } }

canvas.addEventListener('mousedown', onPointerDown);
canvas.addEventListener('mousemove', onPointerMove);
canvas.addEventListener('mouseup', onPointerUp);
canvas.addEventListener('touchstart', onPointerDown, {passive: false});
canvas.addEventListener('touchmove', onPointerMove, {passive: false});
canvas.addEventListener('touchend', onPointerUp);
canvas.addEventListener('contextmenu', e => e.preventDefault());
// 画布外松开鼠标 / 触摸取消也统一清理状态，避免 isDrawing 等标志卡死
window.addEventListener('mouseup', onPointerUp);
window.addEventListener('touchend', onPointerUp);
window.addEventListener('touchcancel', onPointerUp);

// onPointerDown（支持双指检测）
function onPointerDown(e) {
  e.preventDefault();
  const pos = getEventPos(e);

  // 双指触摸检测
  if (e.touches && e.touches.length === 2) {
    isTouchPinch = true;
    const t1 = e.touches[0];
    const t2 = e.touches[1];
    lastTouchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
    return;
  }

  if (isViewMode) {
    if (e.button === 2 || (e.touches && e.touches.length === 2)) {
      isPanning = true;
      lastScreen = { x: pos.x, y: pos.y };
      return;
    }
    if (e.button === 0 || (e.touches && e.touches.length === 1)) {
      isPanning = true;
      lastScreen = { x: pos.x, y: pos.y };
      return;
    }
    return;
  }

  const world = toWorld(pos.x, pos.y);
  pointerDownPos = pos; isPointerDown = true;
  if(e.button===2 || (e.touches && e.touches.length===2)) { clearLongPress(); isPanning=true; isLongPressPan=false; lastScreen={x:pos.x,y:pos.y}; return; }
  clearLongPress();
  if(currentTool==='select') {
    if(selectedShapeIndex!==-1) {
      const shape = shapes[selectedShapeIndex];
      if (isShapeEditable(shape)) {
        const handle = hitHandle(shape, world.x, world.y);
        if(handle) { dragHandle=handle; dragStartShape=JSON.parse(JSON.stringify(shape)); dragStartPos=world; return; }
        if(isPointInShape(world.x, world.y, shape)) {
          isMovingShape=true; moveStartPos=world;
          const bounds = getShapeBounds(shape);
          moveStartShapeBounds={minX:bounds.minX, minY:bounds.minY, maxX:bounds.maxX, maxY:bounds.maxY};
          return;
        }
      } else {
        selectedShapeIndex = -1;
        document.getElementById('propertiesSection').style.display = 'none';
        document.getElementById('textProps').style.display = 'none';
        redraw();
        return;
      }
    }
    let found = false; selectedShapeIndex = -1;
    for(let i=shapes.length-1;i>=0;i--) {
      const shape = shapes[i];
      if (isShapeEditable(shape) && isPointInShape(world.x, world.y, shape)) {
        selectedShapeIndex=i; document.getElementById('propertiesSection').style.display='block';
        loadShapeProperties(shapes[i]); found=true; redraw(); break;
      }
    }
    if(!found) {
      document.getElementById('propertiesSection').style.display='none';
      document.getElementById('textProps').style.display='none';
      redraw();
      longPressTimer = setTimeout(()=>{ if(isPointerDown && !dragHandle && !isMovingShape && !isDrawing) { isLongPressPan=true; isPanning=true; lastScreen={x:pos.x,y:pos.y}; canvas.style.cursor='grabbing'; } }, 300);
    }
  } else if(currentTool==='freehand') {
    isDrawing=true; tempShape={type:'freehand',points:[{x:world.x,y:world.y}],x:world.x,y:world.y,w:0,h:0,strokeColor:document.getElementById('strokeColor').value,strokeWidth:parseInt(document.getElementById('strokeWidth').value),fill:'none', fromTemplate: false};
    shapes.push(tempShape); redraw();
  } else if(currentTool==='circle') {
    isDrawing=true; tempShape=createShape('ellipse',world.x,world.y,0,0); tempShape.circleCenter={x:world.x,y:world.y}; shapes.push(tempShape); redraw();
  } else {
    isDrawing=true;
    if(currentTool==='arrow') {
      tempShape = createShape('arrow', 0, 0, 0, 0, { x1: world.x, y1: world.y, x2: world.x, y2: world.y });
    } else if(['line'].includes(currentTool)) {
      tempShape=createShape(currentTool,world.x,world.y,0,0,{x1:world.x,y1:world.y,x2:world.x,y2:world.y});
    } else {
      tempShape=createShape(currentTool,world.x,world.y,0,0);
    }
    shapes.push(tempShape); redraw();
  }
}

// onPointerMove（支持双指缩放）
function onPointerMove(e) {
  e.preventDefault();
  const pos = getEventPos(e);

  // 双指缩放
  if (isTouchPinch && e.touches && e.touches.length === 2) {
    const t1 = e.touches[0];
    const t2 = e.touches[1];
    const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
    if (lastTouchDist > 0) {
      const ratio = dist / lastTouchDist;
      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;
      const rect = canvas.getBoundingClientRect();
      const sx = midX - rect.left;
      const sy = midY - rect.top;
      const world = toWorld(sx, sy);
      let newScale = scale * ratio;
      newScale = clampScale(newScale);
      if (newScale !== scale) {
        offsetX = world.x - sx / newScale;
        offsetY = world.y - (canvas.height - sy) / newScale;
        clampOffset();
        scale = newScale;
        redraw();
      }
    }
    lastTouchDist = dist;
    return;
  }

  if (isViewMode) {
    if (isPanning) {
      const dx = pos.x - lastScreen.x;
      const dy = pos.y - lastScreen.y;
      offsetX -= dx / scale;
      offsetY += dy / scale;
      clampOffset();
      lastScreen = { x: pos.x, y: pos.y };
      redraw();
    }
    return;
  }

  const world = toWorld(pos.x, pos.y);
  if(isPointerDown && !isPanning && !isLongPressPan && !dragHandle && !isMovingShape && !isDrawing) {
    const dx=pos.x-pointerDownPos.x, dy=pos.y-pointerDownPos.y;
    if(Math.abs(dx)>20||Math.abs(dy)>20) clearLongPress();
  }
  if(isPanning||isLongPressPan) {
    const dx=pos.x-lastScreen.x, dy=pos.y-lastScreen.y;
    offsetX-=dx/scale; offsetY+=dy/scale; clampOffset(); lastScreen={x:pos.x,y:pos.y}; redraw(); return;
  }
  if(dragHandle) {
    if (selectedShapeIndex !== -1 && isShapeEditable(shapes[selectedShapeIndex])) {
      updateShapeWithHandle(world);
      redraw();
    } else {
      dragHandle = null;
    }
  }
  else if(isMovingShape) {
    if (selectedShapeIndex !== -1 && isShapeEditable(shapes[selectedShapeIndex])) {
      const shape=shapes[selectedShapeIndex];
      const dx=world.x-moveStartPos.x, dy=world.y-moveStartPos.y;
      applyBoundsToShape(shape, moveStartShapeBounds.minX+dx, moveStartShapeBounds.minY+dy, moveStartShapeBounds.maxX+dx, moveStartShapeBounds.maxY+dy);
      redraw();
    } else {
      isMovingShape = false;
    }
  } else if(isDrawing && tempShape) {
    if(tempShape.type==='circle'||tempShape.circleCenter) {
      const cx=tempShape.circleCenter.x, cy=tempShape.circleCenter.y, r=Math.hypot(world.x-cx,world.y-cy);
      tempShape.x=cx-r; tempShape.y=cy-r; tempShape.w=r*2; tempShape.h=r*2;
    } else if(tempShape.x1!==undefined) {
      tempShape.x2=world.x; tempShape.y2=world.y;
    } else if(tempShape.type==='freehand') {
      tempShape.points.push({x:world.x,y:world.y});
      updateFreehandBounds(tempShape);
    } else {
      // 反向拖动（从右下往左上）也归一化为正宽高
      const nw=Math.abs(world.x-tempShape.x), nh=Math.abs(world.y-tempShape.y);
      tempShape.x=Math.min(tempShape.x,world.x); tempShape.y=Math.min(tempShape.y,world.y);
      tempShape.w=nw; tempShape.h=nh;
    }
    redraw();
  }
}

// onPointerUp（重置双指状态 + 统一清理，画布外松开也不卡死）
function onPointerUp(e) {
  if (e && e.preventDefault) e.preventDefault();

  // 重置双指状态
  if (isTouchPinch) {
    isTouchPinch = false;
    lastTouchDist = 0;
  }

  if (isViewMode) {
    isPanning = false;
    isPointerDown = false;
    return;
  }
  clearLongPress(); isPointerDown = false;
  if(isLongPressPan){ isLongPressPan=false; isPanning=false; canvas.style.cursor='crosshair'; return; }
  if(isPanning){ isPanning=false; return; }

  // 先移除临时字段，再保存历史（避免 circleCenter 残留入库）
  if(tempShape&&tempShape.circleCenter) delete tempShape.circleCenter;

  if (isDrawing && tempShape) {
    // 丢弃未拖动产生的退化形状（w/h 为 0 或过小），不入历史
    const degenerate = tempShape.x1 === undefined &&
      (tempShape.w === undefined || tempShape.w === 0 || Math.abs(tempShape.w) < 2 ||
       tempShape.h === undefined || tempShape.h === 0 || Math.abs(tempShape.h) < 2);
    if (degenerate) {
      const idx = shapes.indexOf(tempShape);
      if (idx !== -1) shapes.splice(idx, 1);
      isDrawing = false; dragHandle = null; isMovingShape = false; tempShape = null;
      redraw();
      return;
    }
    saveState();
  } else if (dragHandle || isMovingShape) {
    saveState();
  }
  isDrawing=false; dragHandle=null; isMovingShape=false; tempShape=null;
}

function updateShapeWithHandle(world) {
  const shape=shapes[selectedShapeIndex], origBounds=getShapeBounds(dragStartShape);
  let {minX,minY,maxX,maxY}=origBounds;
  const dx=world.x-dragStartPos.x, dy=world.y-dragStartPos.y, MIN_SIZE=10;
  switch(dragHandle) {
    case 'tl': minX+=dx; maxY+=dy; break;
    case 'tr': maxX+=dx; maxY+=dy; break;
    case 'br': maxX+=dx; minY+=dy; break;
    case 'bl': minX+=dx; minY+=dy; break;
    case 'tm': maxY+=dy; break;
    case 'bm': minY+=dy; break;
    case 'lm': minX+=dx; break;
    case 'rm': maxX+=dx; break;
    case 'rot': { const cx=(minX+maxX)/2, cy=(minY+maxY)/2; shape.rotation=(dragStartShape.rotation||0)+(Math.atan2(world.y-cy,world.x-cx)-Math.atan2(dragStartPos.y-cy,dragStartPos.x-cx)); return; }
  }
  if(maxX-minX<MIN_SIZE){ const mid=(minX+maxX)/2; minX=mid-MIN_SIZE/2; maxX=mid+MIN_SIZE/2; }
  if(maxY-minY<MIN_SIZE){ const mid=(minY+maxY)/2; minY=mid-MIN_SIZE/2; maxY=mid+MIN_SIZE/2; }
  applyBoundsToShape(shape, minX, minY, maxX, maxY);
}

function hitHandle(shape, wx, wy) {
  if (!isShapeEditable(shape)) return null;
  const bounds=getShapeBounds(shape); if(bounds.minX===Infinity) return null;
  const hitRadius=8/scale, cx=(bounds.minX+bounds.maxX)/2, cy=(bounds.minY+bounds.maxY)/2, rotation=shape.rotation||0;
  const handles = [
    {type:'tl',x:bounds.minX,y:bounds.maxY},{type:'tr',x:bounds.maxX,y:bounds.maxY},{type:'br',x:bounds.maxX,y:bounds.minY},{type:'bl',x:bounds.minX,y:bounds.minY},
    {type:'tm',x:cx,y:bounds.maxY},{type:'bm',x:cx,y:bounds.minY},{type:'lm',x:bounds.minX,y:cy},{type:'rm',x:bounds.maxX,y:cy},{type:'rot',x:cx,y:bounds.maxY+20}
  ];
  for(let h of handles){ let hx=h.x,hy=h.y; if(rotation){ const cos=Math.cos(rotation),sin=Math.sin(rotation); const dx=h.x-cx,dy=h.y-cy; hx=cx+dx*cos-dy*sin; hy=cy+dx*sin+dy*cos; } if(Math.hypot(wx-hx,wy-hy)<hitRadius) return h.type; }
  return null;
}

// ---------- 形状碰撞检测（修复旋转箭头无法选中） ----------
function isPointInShape(wx, wy, shape) {
  if (!isShapeEditable(shape)) return false;

  // 对箭头和直线，先处理旋转
  if ((shape.type === 'line' || shape.type === 'arrow') && shape.rotation) {
    const cx = (shape.x1 + shape.x2) / 2;
    const cy = (shape.y1 + shape.y2) / 2;
    const cos = Math.cos(-shape.rotation);
    const sin = Math.sin(-shape.rotation);
    const dx = wx - cx, dy = wy - cy;
    wx = cx + dx * cos - dy * sin;
    wy = cy + dx * sin + dy * cos;
  }

  // 椭圆仅轮廓
  if (shape.type === 'ellipse') {
    const cx = shape.x + shape.w / 2;
    const cy = shape.y + shape.h / 2;
    const rx = shape.w / 2;
    const ry = shape.h / 2;
    let lx = wx - cx;
    let ly = wy - cy;
    if (shape.rotation) {
      const cos = Math.cos(-shape.rotation);
      const sin = Math.sin(-shape.rotation);
      const dx = lx, dy = ly;
      lx = dx * cos - dy * sin;
      ly = dx * sin + dy * cos;
    }
    if (rx <= 0 || ry <= 0) return false;
    const norm = Math.sqrt((lx * lx) / (rx * rx) + (ly * ly) / (ry * ry));
    const strokeWidth = shape.strokeWidth || 2;
    const tolerance = (strokeWidth / 2) / Math.min(rx, ry) + 0.03;
    return Math.abs(norm - 1) < tolerance;
  }

  // 直线和箭头：精确检测（已处理旋转）
  if (shape.type === 'line' || shape.type === 'arrow') {
    if (shape.x1 === undefined || shape.x2 === undefined) return false;
    const x1 = shape.x1, y1 = shape.y1;
    const x2 = shape.x2, y2 = shape.y2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) {
      const dist = Math.sqrt((wx - x1) * (wx - x1) + (wy - y1) * (wy - y1));
      const threshold = Math.max(3, (shape.strokeWidth || 2) / 2 + 5) / scale;
      return dist < threshold;
    }
    const t = ((wx - x1) * dx + (wy - y1) * dy) / (len * len);
    let projX, projY;
    if (t < 0) { projX = x1; projY = y1; }
    else if (t > 1) { projX = x2; projY = y2; }
    else { projX = x1 + t * dx; projY = y1 + t * dy; }
    const dist = Math.sqrt((wx - projX) * (wx - projX) + (wy - projY) * (wy - projY));
    const strokeWidth = shape.strokeWidth || 2;
    const threshold = Math.max(3, strokeWidth / 2 + 5) / scale;
    return dist < threshold;
  }

  // 其他形状使用路径检测
  const path = ShapeGenerator.getPath(shape);
  ctx.save();
  ctx.translate(0, canvas.height);
  ctx.scale(1, -1);
  ctx.translate(-offsetX * scale, -offsetY * scale);
  ctx.scale(scale, scale);
  const bounds = getShapeBounds(shape);
  const bCx = (bounds.minX + bounds.maxX) / 2;
  const bCy = (bounds.minY + bounds.maxY) / 2;
  if (shape.rotation) {
    ctx.translate(bCx, bCy);
    ctx.rotate(shape.rotation);
    ctx.translate(-bCx, -bCy);
  }
  let result = ctx.isPointInPath(path, wx, wy);
  ctx.restore();
  if (result) return true;
  return (wx >= bounds.minX && wx <= bounds.maxX &&
          wy >= bounds.minY && wy <= bounds.maxY);
}

// ---------- 加载形状属性（含备注） ----------
function loadShapeProperties(shape) {
  if (isViewMode) return;
  const editable = isShapeEditable(shape);
  document.getElementById('fillColor').value = shape.fillColor || '#00c8ff';
  document.getElementById('fillType').value = shape.fill || 'solid';
  document.getElementById('strokeColor').value = shape.strokeColor || '#ffffff';
  document.getElementById('strokeWidth').value = shape.strokeWidth || 2;
  document.getElementById('opacity').value = shape.opacity !== undefined ? shape.opacity : 1;
  const textProps = document.getElementById('textProps');
  if (shape.type === 'text' || shape.type === 'verticalText') {
    textProps.style.display = 'block';
    document.getElementById('textContent').value = shape.text || '';
    document.getElementById('fontSize').value = shape.fontSize || 20;
  } else {
    textProps.style.display = 'none';
  }

  const remarkInput = document.getElementById('remarkInput');
  if (remarkInput) {
    remarkInput.value = shape.remark || '';
    remarkInput.disabled = !editable;
  }

  const inputs = ['fillColor', 'fillType', 'strokeColor', 'strokeWidth', 'opacity', 'textContent', 'fontSize'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = !editable;
  });
  document.getElementById('deleteShapeBtn').style.display = editable ? 'block' : 'none';
}

// ---------- 滚轮缩放 ----------
container.addEventListener('wheel', e => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect(), sx = e.clientX - rect.left, sy = e.clientY - rect.top, world = toWorld(sx, sy);
  let newScale = scale * (e.deltaY < 0 ? 1.08 : 0.92);
  newScale = clampScale(newScale);
  offsetX = world.x - sx / newScale;
  offsetY = world.y - (canvas.height - sy) / newScale;
  clampOffset();
  scale = newScale;
  redraw();
}, {passive: false});

// ---------- UI 事件（仅编辑模式） ----------
if (!isViewMode) {
  document.getElementById('fillType').addEventListener('change', e => {
    document.getElementById('textureUpload').style.display = e.target.value === 'texture' ? 'block' : 'none';
    if (selectedShapeIndex !== -1 && isShapeEditable(shapes[selectedShapeIndex])) {
      shapes[selectedShapeIndex].fill = e.target.value;
      redraw();
    }
  });
  document.getElementById('fillColor').addEventListener('input', e => {
    if (selectedShapeIndex !== -1 && isShapeEditable(shapes[selectedShapeIndex])) {
      shapes[selectedShapeIndex].fillColor = e.target.value;
      redraw();
    }
  });
  document.getElementById('strokeColor').addEventListener('input', e => {
    if (selectedShapeIndex !== -1 && isShapeEditable(shapes[selectedShapeIndex])) {
      shapes[selectedShapeIndex].strokeColor = e.target.value;
      redraw();
    }
  });
  document.getElementById('strokeWidth').addEventListener('input', e => {
    if (selectedShapeIndex !== -1 && isShapeEditable(shapes[selectedShapeIndex])) {
      shapes[selectedShapeIndex].strokeWidth = parseInt(e.target.value);
      redraw();
    }
  });
  document.getElementById('opacity').addEventListener('input', e => {
    if (selectedShapeIndex !== -1 && isShapeEditable(shapes[selectedShapeIndex])) {
      shapes[selectedShapeIndex].opacity = parseFloat(e.target.value);
      redraw();
    }
  });
  document.getElementById('remarkInput').addEventListener('input', function() {
    if (selectedShapeIndex !== -1 && isShapeEditable(shapes[selectedShapeIndex])) {
      const val = this.value.slice(0, 30);
      shapes[selectedShapeIndex].remark = val;
      redraw();
    }
  });

  // 属性面板修改（颜色/粗细/透明度/备注）在 change/blur 时写入撤销历史
  ['fillColor', 'strokeColor', 'strokeWidth', 'opacity', 'remarkInput'].forEach(id => {
    document.getElementById(id).addEventListener('change', saveState);
  });

  // 删除形状（权限控制）
  document.getElementById('deleteShapeBtn').addEventListener('click', () => {
    if (selectedShapeIndex !== -1 && canDeleteShape(shapes[selectedShapeIndex])) {
      shapes.splice(selectedShapeIndex, 1);
      selectedShapeIndex = -1;
      document.getElementById('propertiesSection').style.display = 'none';
      document.getElementById('textProps').style.display = 'none';
      saveState();
      redraw();
    } else {
      alert('您没有权限删除此图形');
    }
  });

  document.getElementById('textureFile').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        textureImage = img;
        if (selectedShapeIndex !== -1 && isShapeEditable(shapes[selectedShapeIndex])) {
          shapes[selectedShapeIndex].fill = 'texture';
          redraw();
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
  document.getElementById('textContent').addEventListener('input', e => {
    if (selectedShapeIndex !== -1 && isShapeEditable(shapes[selectedShapeIndex])) {
      shapes[selectedShapeIndex].text = e.target.value;
      redraw();
    }
  });
  document.getElementById('textContent').addEventListener('blur', saveState);
  document.getElementById('fontSize').addEventListener('input', e => {
    if (selectedShapeIndex !== -1 && isShapeEditable(shapes[selectedShapeIndex])) {
      shapes[selectedShapeIndex].fontSize = parseInt(e.target.value);
      redraw();
    }
  });
  document.getElementById('fontSize').addEventListener('change', saveState);

  document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTool = btn.dataset.tool;
    });
  });
  document.getElementById('btnUndo').addEventListener('click', undo);
  document.getElementById('btnRedo').addEventListener('click', redo);
  document.getElementById('btnCopy').addEventListener('click', copyShape);
  document.getElementById('btnPaste').addEventListener('click', pasteShape);
  document.getElementById('btnLocate').addEventListener('click', () => {
    const x = parseInt(document.getElementById('locateX').value);
    const y = parseInt(document.getElementById('locateY').value);
    if (isNaN(x) || isNaN(y)) {
      alert('请输入有效的坐标');
      return;
    }
    locateToPoint(x, y);
  });
}

// ---------- 键盘快捷键 ----------
if (!isViewMode) {
  window.addEventListener('keydown', e => {
    // 焦点在表单控件/可编辑元素时不处理快捷键，避免误删图形或误触发复制粘贴
    const tag = (e.target && (e.target.tagName || '')).toLowerCase();
    if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) return;
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        copyShape();
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        pasteShape();
      }
    } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedShapeIndex !== -1) {
      if (canDeleteShape(shapes[selectedShapeIndex])) {
        shapes.splice(selectedShapeIndex, 1);
        selectedShapeIndex = -1;
        document.getElementById('propertiesSection').style.display = 'none';
        document.getElementById('textProps').style.display = 'none';
        saveState();
        redraw();
      } else {
        alert('您没有权限删除此图形');
      }
    }
  });
}

toolbar.addEventListener('click', e => {
  if (isViewMode) return;
  const title = e.target.closest('.section-title');
  if (!title) return;
  const content = title.nextElementSibling;
  if (content) content.classList.toggle('collapsed');
});

// ========== Supabase 数据交互 ==========
// 校验形状是否完好（防止 null/NaN/Infinity 等损坏数据入库或拖垮渲染）
function isValidShape(shape) {
  if (!shape || typeof shape.type !== 'string') return false;
  const numFields = ['x', 'y', 'w', 'h', 'x1', 'y1', 'x2', 'y2'];
  for (let i = 0; i < numFields.length; i++) {
    const v = shape[numFields[i]];
    if (v !== undefined && !Number.isFinite(v)) return false;
  }
  if (Array.isArray(shape.points)) {
    for (let i = 0; i < shape.points.length; i++) {
      const pt = shape.points[i];
      if (!pt || !Number.isFinite(pt.x) || !Number.isFinite(pt.y)) return false;
    }
  }
  return true;
}

// 键排序后序列化，用于跨端（GitHub 后端存取）稳定比较 shapes
function sortKeys(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sortKeys);
  const out = {};
  Object.keys(obj).sort().forEach(k => { out[k] = sortKeys(obj[k]); });
  return out;
}
function canonicalShapesJson(shapesArr) {
  return JSON.stringify((shapesArr || []).map(sortKeys));
}

async function loadMap() {
  const { data, error } = await supabase
    .from('guild_maps')
    .select('*')
    .eq('id', mapId)
    .maybeSingle();

  if (error || !data) {
    alert('地图不存在或加载失败');
    window.location.href = '../strategy_map.html';
    return;
  }

  currentMap = data;
  isGalaxyMode = (data.type === 'galaxy');
  document.getElementById('mapTitle').textContent = data.name;
  // 清洗一次：过滤 null/残缺对象，避免单个损坏形状拖垮渲染
  shapes = (data.shapes || []).filter(isValidShape);
  loadedShapesSnapshot = canonicalShapesJson(data.shapes || []);
  dirty = false;
  initHistory();
  redraw();
}

async function saveMap() {
  if (!currentMap) {
    alert('没有加载的地图');
    return;
  }

  // 保存前校验：跳过含 NaN/Infinity 等非法数值的损坏形状，避免污染存档
  const cleanShapes = shapes.filter(isValidShape);

  // 保存前重读比对：服务端已被他人修改时提示
  const { data: fresh, error: freshError } = await supabase
    .from('guild_maps')
    .select('shapes')
    .eq('id', currentMap.id)
    .maybeSingle();
  if (!freshError && fresh) {
    const serverShapesStr = canonicalShapesJson(fresh.shapes || []);
    if (serverShapesStr !== loadedShapesSnapshot) {
      if (!confirm('地图已被他人修改，是否覆盖？')) return;
    }
  }

  const { error } = await supabase
    .from('guild_maps')
    .update({ shapes: cleanShapes })
    .eq('id', currentMap.id);

  if (error) {
    alert('保存失败: ' + error.message);
    return;
  }

  loadedShapesSnapshot = canonicalShapesJson(cleanShapes);
  dirty = false;
  alert('保存成功');
}

document.getElementById('saveBtn').addEventListener('click', saveMap);

// 返回链接：有未保存更改时 confirm 提示
const backBtn = document.getElementById('backBtn');
if (backBtn) {
  backBtn.addEventListener('click', e => {
    if (dirty && !confirm('有未保存的更改，确定离开吗？')) e.preventDefault();
  });
}

// ========== 初始化 ==========
async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode') || 'edit';
  isViewMode = (mode === 'view');

  if (isViewMode) {
    document.getElementById('toolbar').style.display = 'none';
    document.getElementById('saveBtn').style.display = 'none';
  }

  await loadMap();

  if (!isViewMode) {
    createShapeButtons();
  }

  resizeCanvas();
  fitToShapes();
  redraw();
  startAnimation();

  window.addEventListener('beforeunload', e => {
    stopAnimation();
    if (dirty) {
      e.preventDefault();
      e.returnValue = '有未保存的更改';
    }
  });
}

init();