// ========== 全局变量 ==========
const params = new URLSearchParams(window.location.search);
const mapId = params.get('id');
let currentMap = null;
let shapes = [];

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

// 剪贴板
let clipboardShape = null;

// 只读模式
let isViewMode = false;

// ---------- 触摸缩放新增 ----------
let lastTouchDist = 0;
let isTouchPinch = false;

// ---------- 模板图形只读标记 ----------
let isGalaxyMode = false;  // 当前地图是否为星系地图

// ---------- 撤回/回撤系统 ----------
const MAX_HISTORY = 50;
let history = [];
let historyIndex = -1;

function saveState() {
  if (isViewMode) return;
  history = history.slice(0, historyIndex + 1);
  const snapshot = JSON.parse(JSON.stringify(shapes));
  history.push(snapshot);
  if (history.length > MAX_HISTORY) {
    history.shift();
  } else {
    historyIndex++;
  }
}

function undo() {
  if (isViewMode) return;
  if (historyIndex <= 0) return;
  historyIndex--;
  shapes = JSON.parse(JSON.stringify(history[historyIndex]));
  selectedShapeIndex = -1;
  document.getElementById('propertiesSection').style.display = 'none';
  document.getElementById('textProps').style.display = 'none';
  redraw();
}

function redo() {
  if (isViewMode) return;
  if (historyIndex >= history.length - 1) return;
  historyIndex++;
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
  const worldVisibleW = canvas.width / scale;
  const worldVisibleH = canvas.height / scale;
  if (worldVisibleW > WORLD_MAX - WORLD_MIN) {
    offsetX = (WORLD_MIN + WORLD_MAX - worldVisibleW) / 2;
  } else {
    offsetX = Math.max(WORLD_MIN, Math.min(WORLD_MAX - worldVisibleW, offsetX));
  }
  if (worldVisibleH > WORLD_MAX - WORLD_MIN) {
    offsetY = (WORLD_MIN + WORLD_MAX - worldVisibleH) / 2;
  } else {
    offsetY = Math.max(WORLD_MIN, Math.min(WORLD_MAX - worldVisibleH, offsetY));
  }
}

function clampScale(newScale) {
  const maxScale = Math.min(canvas.width / 10, canvas.height / 10);
  const minScale = Math.max(canvas.width / (WORLD_MAX - WORLD_MIN), canvas.height / (WORLD_MAX - WORLD_MIN));
  return Math.max(minScale, Math.min(maxScale, newScale));
}

// ---------- 精确包围盒计算 ----------
function getShapeBounds(shape) {
  const { type } = shape;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const addPoint = (x, y) => {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  };

  if (shape.x1 !== undefined && shape.x2 !== undefined) {
    addPoint(shape.x1, shape.y1);
    addPoint(shape.x2, shape.y2);
    if (type !== 'line' && type !== 'arrow') {
      const headSize = 10;
      const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);
      addPoint(shape.x2, shape.y2);
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
    if (type === 'text' || type === 'verticalText' || type === 'city' || type === 'frame' || type === 'brokenFrame' || type === 'arc') {
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
      case 'freehand': if (shape.points) { p.moveTo(shape.points[0].x, shape.points[0].y); shape.points.forEach(pt => p.lineTo(pt.x, pt.y)); } break;
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

// ---------- 空心弧绘制 ----------
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

// ---------- 城市三层绘制 ----------
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

// ---------- 黄色方形边框 ----------
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

// ---------- 左右断开方框 ----------
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

// ---------- 绘制箭头距离 ----------
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

// ---------- 判断形状是否可编辑 ----------
function isShapeEditable(shape) {
  // 如果是星系地图且形状有 fromTemplate 标记，则不可编辑
  if (isGalaxyMode && shape.fromTemplate === true) {
    return false;
  }
  return true;
}

// ---------- 形状预设（只保留一种箭头） ----------
const shapePresets = [
  { category: '矩形', shapes: [{ type: 'rect', name: '矩形' }, { type: 'roundRect', name: '圆角矩形' }] },
  { category: '基本形状', shapes: [
    { type: 'ellipse', name: '椭圆' }, { type: 'triangle', name: '等腰三角' }, { type: 'rightTriangle', name: '直角三角' },
    { type: 'diamond', name: '菱形' }, { type: 'parallelogram', name: '平行四边形' }, { type: 'trapezoid', name: '梯形' },
    { type: 'pentagon', name: '正五边形' }, { type: 'hexagon', name: '六边形' }, { type: 'star', name: '星形' },
    { type: 'cross', name: '十字形' }, { type: 'plus', name: '加号' },
    { type: 'arc', name: '空心弧' },
    { type: 'text', name: '文本框' }
  ]},
  { category: '设施', shapes: [
    { type: 'city', name: '城市' },
    { type: 'frame', name: '方形边框' },
    { type: 'brokenFrame', name: '断开方框' }
  ]},
  { category: '箭头', shapes: [
    { type: 'arrow', name: '箭头' }
  ]}
];

// ---------- 工具栏按钮创建 ----------
const toolbar = document.getElementById('toolbar');
function createShapeButtons() {
  if (isViewMode) return;
  shapePresets.forEach(cat => {
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
        } else if (s.type === 'city') {
          newShape = createShape('city', center.x-60, center.y-60, 120, 120, {
            fill: 'solid',
            fillColor: '#ffcc00',
            strokeColor: '#ffcc00'
          });
        } else if (s.type === 'frame') {
          newShape = createShape('frame', center.x-50, center.y-50, 100, 100, {
            fill: 'none',
            strokeColor: '#ffcc00',
            strokeWidth: 4
          });
        } else if (s.type === 'brokenFrame') {
          newShape = createShape('brokenFrame', center.x-50, center.y-50, 100, 100, {
            fill: 'none',
            strokeColor: '#ffcc00',
            strokeWidth: 4
          });
        } else if (s.type === 'arc') {
          newShape = createShape('arc', center.x-50, center.y-50, 100, 100, {
            fill: 'none',
            strokeColor: '#ffffff',
            strokeWidth: 4
          });
        } else {
          newShape = createShape(s.type, Math.max(0, center.x-50), Math.max(0, center.y-50), 100, 100);
        }
        // 新形状默认可编辑（fromTemplate: false）
        shapes.push(newShape);
        saveState();
        redraw();
      });
      content.appendChild(btn);
    });
    toolbar.insertBefore(section, document.getElementById('propertiesSection'));
  });
}

function drawShapeIcon(ictx, type, x, y, w, h) {
  const shape = { type, x, y, w, h };
  if (type === 'arrow') {
    shape.x1 = x; shape.y1 = y; shape.x2 = x+w; shape.y2 = y+h;
  } else if (type === 'text') {
    shape.text = 'T';
    shape.fontSize = 12;
  }
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
  const p = ShapeGenerator.getPath(shape);
  ictx.fill(p); ictx.stroke(p);
}

// ---------- 创建形状对象（支持箭头和 fromTemplate） ----------
function createShape(type, x, y, w, h, props={}) {
  const defaults = {
    type, x, y, w: w||100, h: h||100, rotation:0,
    fill: 'solid', fillColor: '#00c8ff', strokeColor: '#ffffff', strokeWidth: 2, opacity: 1,
    text: '文本', fontSize: 20,
    fromTemplate: false   // 是否为从模板复制的图形
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
  // 粘贴后的新形状默认可编辑（fromTemplate: false）
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
  }
  shapes.push(newShape);
  selectedShapeIndex = shapes.length - 1;
  document.getElementById('propertiesSection').style.display = 'block';
  loadShapeProperties(newShape);
  saveState();
  redraw();
}

// ---------- 坐标定位函数 ----------
function locateToPoint(worldX, worldY) {
  worldX = Math.max(WORLD_MIN, Math.min(WORLD_MAX, worldX));
  worldY = Math.max(WORLD_MIN, Math.min(WORLD_MAX, worldY));
  offsetX = worldX - canvas.width / (2 * scale);
  offsetY = worldY - canvas.height / (2 * scale);
  clampOffset();
  targetMarker = { worldX, worldY, startTime: Date.now(), duration: 10000 };
  redraw();
}

// ---------- 画布渲染 ----------
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

  // 形状
  shapes.forEach((shape, index) => {
    ctx.save();
    const bounds = getShapeBounds(shape);
    const cx = (bounds.minX + bounds.maxX) / 2;
    const cy = (bounds.minY + bounds.maxY) / 2;
    if (shape.rotation) {
      ctx.translate(cx, cy);
      ctx.rotate(shape.rotation);
      ctx.translate(-cx, -cy);
    }

    const isText = (shape.type === 'text' || shape.type === 'verticalText');
    const isCity = (shape.type === 'city');
    const isFrame = (shape.type === 'frame');
    const isBrokenFrame = (shape.type === 'brokenFrame');
    const isArc = (shape.type === 'arc');
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
      } else if (shape.fill === 'texture' && textureImage) ctx.fillStyle = ctx.createPattern(textureImage, 'repeat');
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

    ctx.restore();
    if (isText && shape.text) drawTextOnCanvas(shape);
    // 绘制箭头距离（无论是否选中）
    if (shape.type === 'arrow') drawArrowDistance(ctx, shape);
    // 只在编辑模式下显示选中手柄（且形状可编辑）
    if (!isViewMode && index === selectedShapeIndex && isShapeEditable(shape)) {
      drawSelectionHandles(shape);
    }
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
      // 只有可编辑的形状才能操作
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
        // 不可编辑的形状，点击后取消选中但不报错
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
    isDrawing=true; tempShape={type:'freehand',points:[{x:world.x,y:world.y}],strokeColor:document.getElementById('strokeColor').value,strokeWidth:parseInt(document.getElementById('strokeWidth').value),fill:'none', fromTemplate: false};
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
    // 再次检查形状可编辑性
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
    } else {
      tempShape.w=Math.max(1,world.x-tempShape.x); tempShape.h=Math.max(1,world.y-tempShape.y);
    }
    redraw();
  }
}

// onPointerUp（重置双指状态）
function onPointerUp(e) {
  e.preventDefault();

  // 重置双指状态
  if (isTouchPinch) {
    isTouchPinch = false;
    lastTouchDist = 0;
    return;
  }

  if (isViewMode) {
    isPanning = false;
    return;
  }
  clearLongPress(); isPointerDown=false;
  if(isLongPressPan){ isLongPressPan=false; isPanning=false; canvas.style.cursor='crosshair'; return; }
  if(isPanning){ isPanning=false; return; }
  if(dragHandle||isMovingShape||(isDrawing&&tempShape)) saveState();
  if(tempShape&&tempShape.circleCenter) delete tempShape.circleCenter;
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

// 椭圆仅轮廓可选中（同时检查可编辑性）
function isPointInShape(wx, wy, shape) {
  if (!isShapeEditable(shape)) return false;
  if (shape.type === 'ellipse') {
    const cx = shape.x + shape.w/2;
    const cy = shape.y + shape.h/2;
    const rx = shape.w/2;
    const ry = shape.h/2;
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
    if (Math.abs(norm - 1) < tolerance) return true;
    return false;
  }
  const path = ShapeGenerator.getPath(shape);
  ctx.save(); ctx.translate(0,canvas.height); ctx.scale(1,-1); ctx.translate(-offsetX*scale,-offsetY*scale); ctx.scale(scale,scale);
  const bounds=getShapeBounds(shape), b_cx=(bounds.minX+bounds.maxX)/2, b_cy=(bounds.minY+bounds.maxY)/2;
  if(shape.rotation){ ctx.translate(b_cx,b_cy); ctx.rotate(shape.rotation); ctx.translate(-b_cx,-b_cy); }
  const result = ctx.isPointInPath(path, wx, wy); ctx.restore();
  if(result) return true;
  return (wx>=bounds.minX&&wx<=bounds.maxX&&wy>=bounds.minY&&wy<=bounds.maxY);
}

function loadShapeProperties(shape) {
  if (isViewMode) return;
  const editable = isShapeEditable(shape);
  document.getElementById('fillColor').value=shape.fillColor||'#00c8ff';
  document.getElementById('fillType').value=shape.fill||'solid';
  document.getElementById('strokeColor').value=shape.strokeColor||'#ffffff';
  document.getElementById('strokeWidth').value=shape.strokeWidth||2;
  document.getElementById('opacity').value=shape.opacity!==undefined?shape.opacity:1;
  const textProps=document.getElementById('textProps');
  if(shape.type==='text'||shape.type==='verticalText'){ textProps.style.display='block'; document.getElementById('textContent').value=shape.text||''; document.getElementById('fontSize').value=shape.fontSize||20; }
  else textProps.style.display='none';
  // 根据可编辑性启用/禁用控件
  const inputs = ['fillColor', 'fillType', 'strokeColor', 'strokeWidth', 'opacity', 'textContent', 'fontSize'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = !editable;
  });
  document.getElementById('deleteShapeBtn').style.display = editable ? 'block' : 'none';
}

container.addEventListener('wheel', e => {
  e.preventDefault();
  const rect=canvas.getBoundingClientRect(), sx=e.clientX-rect.left, sy=e.clientY-rect.top, world=toWorld(sx,sy);
  let newScale=scale*(e.deltaY<0?1.08:0.92); newScale=clampScale(newScale);
  offsetX=world.x-sx/newScale; offsetY=world.y-(canvas.height-sy)/newScale; clampOffset(); scale=newScale; redraw();
}, {passive:false});

// UI 事件（仅编辑模式可用）
if (!isViewMode) {
  document.getElementById('fillType').addEventListener('change', e => {
    document.getElementById('textureUpload').style.display=e.target.value==='texture'?'block':'none';
    if(selectedShapeIndex!==-1 && isShapeEditable(shapes[selectedShapeIndex])) {
      shapes[selectedShapeIndex].fill=e.target.value; redraw();
    }
  });
  document.getElementById('fillColor').addEventListener('input', e => {
    if(selectedShapeIndex!==-1 && isShapeEditable(shapes[selectedShapeIndex])) {
      shapes[selectedShapeIndex].fillColor=e.target.value; redraw();
    }
  });
  document.getElementById('strokeColor').addEventListener('input', e => {
    if(selectedShapeIndex!==-1 && isShapeEditable(shapes[selectedShapeIndex])) {
      shapes[selectedShapeIndex].strokeColor=e.target.value; redraw();
    }
  });
  document.getElementById('strokeWidth').addEventListener('input', e => {
    if(selectedShapeIndex!==-1 && isShapeEditable(shapes[selectedShapeIndex])) {
      shapes[selectedShapeIndex].strokeWidth=parseInt(e.target.value); redraw();
    }
  });
  document.getElementById('opacity').addEventListener('input', e => {
    if(selectedShapeIndex!==-1 && isShapeEditable(shapes[selectedShapeIndex])) {
      shapes[selectedShapeIndex].opacity=parseFloat(e.target.value); redraw();
    }
  });
  document.getElementById('deleteShapeBtn').addEventListener('click', () => {
    if(selectedShapeIndex!==-1 && isShapeEditable(shapes[selectedShapeIndex])) {
      shapes.splice(selectedShapeIndex,1);
      selectedShapeIndex=-1;
      document.getElementById('propertiesSection').style.display='none';
      document.getElementById('textProps').style.display='none';
      saveState();
      redraw();
    } else {
      alert('当前选中的图形为模板图形，不可删除');
    }
  });
  document.getElementById('textureFile').addEventListener('change', e => {
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const img=new Image();
      img.onload=()=>{
        textureImage=img;
        if(selectedShapeIndex!==-1 && isShapeEditable(shapes[selectedShapeIndex])) {
          shapes[selectedShapeIndex].fill='texture';
          redraw();
        }
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);
  });
  document.getElementById('textContent').addEventListener('input', e => {
    if(selectedShapeIndex!==-1 && isShapeEditable(shapes[selectedShapeIndex])) {
      shapes[selectedShapeIndex].text=e.target.value;
      redraw();
    }
  });
  document.getElementById('textContent').addEventListener('blur', saveState);
  document.getElementById('fontSize').addEventListener('input', e => {
    if(selectedShapeIndex!==-1 && isShapeEditable(shapes[selectedShapeIndex])) {
      shapes[selectedShapeIndex].fontSize=parseInt(e.target.value);
      redraw();
    }
  });
  document.getElementById('fontSize').addEventListener('change', saveState);
  document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tool-btn[data-tool]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      currentTool=btn.dataset.tool;
    });
  });
  document.getElementById('btnUndo').addEventListener('click', undo);
  document.getElementById('btnRedo').addEventListener('click', redo);
  document.getElementById('btnCopy').addEventListener('click', copyShape);
  document.getElementById('btnPaste').addEventListener('click', pasteShape);
  document.getElementById('btnLocate').addEventListener('click', () => {
    const x=parseInt(document.getElementById('locateX').value), y=parseInt(document.getElementById('locateY').value);
    if(isNaN(x)||isNaN(y)){ alert('请输入有效的坐标'); return; }
    locateToPoint(x,y);
  });
}

// 键盘快捷键（仅编辑模式）
if (!isViewMode) {
  window.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        copyShape();
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        pasteShape();
      }
    } else if ((e.key === 'Delete') && selectedShapeIndex !== -1) {
      if (isShapeEditable(shapes[selectedShapeIndex])) {
        shapes.splice(selectedShapeIndex, 1);
        selectedShapeIndex = -1;
        document.getElementById('propertiesSection').style.display = 'none';
        document.getElementById('textProps').style.display = 'none';
        saveState();
        redraw();
      } else {
        alert('当前选中的图形为模板图形，不可删除');
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
async function loadMap() {
  const { data, error } = await supabase
    .from('guild_maps')
    .select('*')
    .eq('id', mapId)
    .maybeSingle();

  if (error || !data) {
    alert('地图不存在或加载失败');
    window.location.href = 'strategy_map.html';
    return;
  }

  currentMap = data;
  isGalaxyMode = (data.type === 'galaxy');
  document.getElementById('mapTitle').textContent = data.name;
  shapes = data.shapes || [];
  initHistory();
  redraw();
}

async function saveMap() {
  if (!currentMap) {
    alert('没有加载的地图');
    return;
  }

  const { error } = await supabase
    .from('guild_maps')
    .update({ shapes: shapes })
    .eq('id', currentMap.id);

  if (error) {
    alert('保存失败: ' + error.message);
    return;
  }

  alert('保存成功');
}

document.getElementById('saveBtn').addEventListener('click', saveMap);

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
  redraw();
}

init();
