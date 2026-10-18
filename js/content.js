/*
 * content.js v4.3.0
 * 三个页面的导出逻辑统一成一套：
 *   tab_type 0 标小智   https://www.logosc.cn/edit          单个 svg（背景/水印是 svg 内的 rect）
 *   tab_type 1 标智客高级编辑 https://www.logomaker.com.cn/editor?case_id=xxx  .svg-canvas-wrapper 下多个 svg 图层
 *   tab_type 2 标智客生成页   https://www.logomaker.com.cn/guide#/generate     shadow DOM 里的单个 svg
 * 尺寸一律从画布自身 viewBox 取，裁剪一律用 getScreenCTM 反算内容包围盒，
 * 因此不再依赖 #rectBox 与图层数量对应，也不再要求右下角缩放为 100%、不需要手动取消编组。
 */
let conf_list = [
  {
    'name': 'bxz', // 标小智
    'min': 34,
    'max': 13600,
    'default': 680
  },
  {
    'name': 'bzk', // 标智客高级编辑页
    'min': 40,
    'max': 16000,
    'default': 800
  },
  {
    'name': 'bzk_guide', // 标智客生成/预览页
    'min': 40,
    'max': 16000,
    'default': 800
  }
]

const url = "https://btools.cc/zatsudan-1/"

// PNG 需要浏览器真的把每个像素画出来：内存约占 宽x高x4 字节，编码也是同步主线程活。
// SVG 只多写两个数字，文件体积不变，所以 SVG 的上限可以很高，位图的上限必须低得多。
// 这两个值是折中：8192x6144（约 5000 万像素，200MB）给过，13600x10200（约 1.4 亿像素，550MB）拦掉。
const PNG_MAX_SIDE = 16384;
const PNG_MAX_PIXELS = 100000000;

/* ===================== 标智客生成页（/guide#/generate）的登录遮罩与画布定位 =====================
 * 新版前端把 LOGO 画布放进了带 Shadow DOM 的自定义元素 <logomaker-logo-editor-new>，
 * 结构（实测 v2.3.82.composer-ab-v4）：
 *   #shadow-root(open) > div.logo-editor > div.stage > div.svg-canvas > svg[viewBox 0 0 800 600]
 *                                                            > g#background > rect
 *                                                            > g#shape_xxxx  （文字已由 /text/textToSvg 转成 path）
 *                            > div.watermark（blob 背景图，水印在这一层，不在 svg 内部）
 * 所以直接序列化这个 svg 得到的就是无水印矢量文件。
 */

// 预览页是否自动移除登录遮罩（div.common_log_unique，fixed + z-index 20100 铺满视口）。
// 想恢复网站默认的登录弹窗，把这行改成 false 即可。
const GUIDE_UNMASK = true;
const GUIDE_MASK_STYLE_ID = 'free-canvas-guide-unmask';

function isGuidePage() {
  return /logomaker\.com\.cn$/i.test(location.hostname) && /^\/guide($|\/)/i.test(location.pathname);
}

// 注入一条 CSS 规则隐藏登录遮罩；用 style 标签而不是删节点，Vue 重新创建弹窗时也照样生效
function unmaskGuideLogin() {
  if (document.getElementById(GUIDE_MASK_STYLE_ID)) {
    return true;
  }
  const style = document.createElement('style');
  style.id = GUIDE_MASK_STYLE_ID;
  style.textContent = '.common_log_unique{display:none !important}';
  (document.head || document.documentElement).appendChild(style);
  return true;
}

// 取预览画布：优先取已经渲染出内容、且可见的那个编辑器
function guideEditor() {
  const nodes = [...document.querySelectorAll('logomaker-logo-editor-new')];
  // 网站如果把 shadow root 改成 closed，content script 就穿不进去了，这里给出明确提示
  const noShadow = nodes.length > 0 && nodes.every((e) => !e.shadowRoot);
  for (const ce of nodes) {
    const root = ce.shadowRoot;
    if (!root) {
      continue;
    }
    const svg = root.querySelector('.svg-canvas svg') || root.querySelector('svg');
    if (svg && svg.children.length > 0 && svg.getBoundingClientRect().width > 0) {
      return { ce, root, svg };
    }
  }
  if (noShadow) {
    throw new Error('预览画布的 Shadow DOM 已关闭，插件读不到矢量数据');
  }
  return null;
}
/* ===================== 生成页专用逻辑结束 ===================== */

const SVG_NS = 'http://www.w3.org/2000/svg';
// 这些是定义性节点，画在屏幕上不可见，不能算进 LOGO 内容的包围盒（标小智的 mask/defs 就直接挂在根 svg 下）
const SKIP_TAGS = ['defs', 'style', 'mask', 'clippath', 'filter', 'lineargradient', 'radialgradient',
  'pattern', 'symbol', 'marker', 'title', 'desc', 'script', 'a'];

// 数值统一成普通十进制，避免 5.684341886080802e-14 这种科学计数法（SVG 1.1 的 viewBox 不认，IE 会解析失败）
function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? String(parseFloat(n.toFixed(6))) : '0';
}

function isBackgroundEl(e) {
  return /^background$/i.test(String(e.id || '')) || /(^|\s)background(\s|$)/i.test(String(e.getAttribute('class') || ''));
}

function isWatermarkEl(e) {
  return /watermark|shuiyin/i.test(`${String(e.id || '')} ${String(e.getAttribute('class') || '')}`);
}

// viewBox 优先，其次 width/height
function parseCanvasBox(svg) {
  const vb = (svg.getAttribute('viewBox') || '').trim().split(/[\s,]+/).map(Number);
  if (vb.length === 4 && vb.every(Number.isFinite) && vb[2] > 0 && vb[3] > 0) {
    return { x: vb[0], y: vb[1], w: vb[2], h: vb[3] };
  }
  const w = parseFloat(svg.getAttribute('width'));
  const h = parseFloat(svg.getAttribute('height'));
  if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) {
    return { x: 0, y: 0, w, h };
  }
  return null;
}

// 元素在所属 svg 用户坐标系下的包围盒：屏幕矩形乘根 svg CTM 的逆矩阵，
// 页面缩放（右下角 61% 之类）、CSS transform、preserveAspectRatio=none 的非等比拉伸都会被算进去
function boxInCanvas(svg, el) {
  const ctm = svg.getScreenCTM();
  const r = el.getBoundingClientRect();
  if (!ctm || r.width <= 0 || r.height <= 0) {
    return null;
  }
  const inv = ctm.inverse();
  const pts = [[r.left, r.top], [r.right, r.top], [r.right, r.bottom], [r.left, r.bottom]]
    .map(([x, y]) => new DOMPoint(x, y).matrixTransform(inv));
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    w: Math.max(...xs) - Math.min(...xs),
    h: Math.max(...ys) - Math.min(...ys)
  };
}

function mergeBox(a, b) {
  if (!a) return b;
  const x2 = Math.max(a.x + a.w, b.x + b.w);
  const y2 = Math.max(a.y + a.h, b.y + b.h);
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    w: x2 - Math.min(a.x, b.x),
    h: y2 - Math.min(a.y, b.y)
  };
}

// 取一个图层里算内容用的节点（跳过定义性节点、背景、水印、隐藏层）
function contentChildren(svg) {
  return [...svg.children].filter((child) => {
    const tag = child.nodeName.toLowerCase();
    if (SKIP_TAGS.indexOf(tag) >= 0) return false;
    if (isBackgroundEl(child) || isWatermarkEl(child)) return false;
    return getComputedStyle(child).display !== 'none';
  });
}

// LOGO 实际内容的包围盒。多图层页面（高级编辑页）每层是独立 svg，但 viewBox 与显示尺寸一致，
// 所以用户坐标系相同，逐层测量再合并即可
function contentBox(base, layers) {
  let box = null;
  for (const svg of [base].concat(layers)) {
    for (const child of contentChildren(svg)) {
      const part = boxInCanvas(svg, child);
      if (!part || part.w <= 0 || part.h <= 0) {
        continue;
      }
      box = mergeBox(box, part);
    }
  }
  if (box) {
    return box;
  }
  try {
    const b = base.getBBox();
    if (b.width > 0 && b.height > 0) {
      return { x: b.x, y: b.y, w: b.width, h: b.height };
    }
  } catch (e) {}
  return parseCanvasBox(base);
}

// 四周先按内容最长边的比例留白
function paddedBox(content, padRatio) {
  const pad = Math.max(content.w, content.h) * padRatio;
  return { x: content.x - pad, y: content.y - pad, w: content.w + 2 * pad, h: content.h + 2 * pad };
}

// 裁剪成正方形：边长取宽和高中较大的那个（木桶效应，短边自动获得留白），
// 垂直方向始终居中，水平方向按 align 决定 LOGO 靠左、居中还是靠右
function squareCanvasBox(box, align) {
  const side = Math.max(box.w, box.h);
  const slack = side - box.w;
  const factor = align === 'left' ? 1 : align === 'right' ? 0 : 0.5;
  return {
    x: box.x - slack * (1 - factor),
    y: box.y - (side - box.h) / 2,
    w: side,
    h: side
  };
}

// 裁剪后又保留背景时，背景矩形/图片要跟着铺满新的画布，否则扩出去的那块是透明的
function fitBackground(bg, box) {
  if (!bg) {
    return;
  }
  const rect = bg.querySelector('rect');
  const image = bg.querySelector('image');
  const target = rect || image;
  if (!target) {
    return;
  }
  target.setAttribute('x', num(box.x));
  target.setAttribute('y', num(box.y));
  target.setAttribute('width', num(box.w));
  target.setAttribute('height', num(box.h));
  if (target === image) {
    // slice：等比放大到盖满裁剪框，不拉伸变形
    target.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  }
}

// 属性值里的科学计数法换成普通小数，只处理几何属性，不碰 base64 和 href
function plainNumbers(markup) {
  return markup.replace(
    /(\s(?:x|y|width|height|cx|cy|rx|ry|viewBox)=")([^"]*)"/g,
    (all, head, value) => head + value.replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi, (m) => {
      const n = Number(m);
      return Number.isFinite(n) && /e/i.test(m) ? num(n) : m;
    }) + '"'
  );
}

// 渐变、滤镜、pattern 这类定义有时不写在画布 svg 里，而是写在页面的公共 <defs> 里
// （实测标小智的 fill="url(#94)" 就是这样），只序列化画布节点会把这些效果丢掉。
// 这里按引用倒查页面，缺哪个补哪个，补进来的定义里再引用的继续补。
function inlineMissingDefs(merged) {
  let missing = [];
  for (let round = 0; round < 12; round++) {
    const html = new XMLSerializer().serializeToString(merged);
    const refs = [...new Set((html.match(/url\(#([^)"']+)\)/g) || []).map((s) => s.slice(5, -1)))];
    const ids = new Set((html.match(/\bid="([^"]+)"/g) || []).map((s) => s.slice(4, -1)));
    missing = refs.filter((r) => !ids.has(r));
    if (missing.length === 0) {
      return missing;
    }
    let defs = merged.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS(SVG_NS, 'defs');
      merged.insertBefore(defs, merged.firstChild);
    }
    let added = 0;
    for (const id of missing) {
      const node = document.getElementById(id);
      if (node && node.ownerDocument === document) {
        defs.appendChild(node.cloneNode(true));
        added++;
      }
    }
    if (added === 0) {
      break; // 页面里也找不到，别再循环
    }
  }
  return missing;
}

/* ===================== 各站点的画布定位 ===================== */

// SVG 源码转 PNG：靠离屏 canvas 绘制后 toBlob，不需要任何第三方库
function rasterizePng(markup, width, height, done, fail) {
  const img = new Image();
  img.onerror = () => fail('位图渲染失败，可能是素材图片跨域或图形本身有问题，请改用 SVG 格式');
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) {
          done(blob);
        } else {
          fail('浏览器没有返回位图，请降低宽度或改用 SVG 格式');
        }
      }, 'image/png');
    } catch (e) {
      // 画布里混进跨域图片时 toBlob 会在这里抛 SecurityError
      fail('导出的图里有跨域素材，画布被保护不能转位图（' + ((e && e.message) || e) + '），请改用 SVG 格式');
    }
  };
  img.src = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }));
}

function dlBlob(blob, filename) {
  const el = document.createElement('a');
  el.setAttribute('download', filename);
  el.setAttribute('href', URL.createObjectURL(blob));
  el.style.display = 'none';
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
}

// 返回 { base, layers }：base 是根 svg（含背景层），layers 是需要并进 base 的其余图层 svg
function collectSources(tab_type) {
  if (tab_type === 0) {
    // 标小智：老的 .card__upper -> parentNode.childNodes[0].children[1] 这条链实测还在
    const upper = document.querySelector('.card__upper');
    const holder = upper && upper.parentNode ? upper.parentNode.childNodes[0] : null;
    const svg = holder && holder.children ? holder.children[1] : null;
    if (!svg || svg.nodeName.toLowerCase() !== 'svg') {
      throw new Error('没有取到标小智的画布节点，页面结构可能又改版了');
    }
    return { base: svg, layers: [] };
  }

  if (tab_type === 1) {
    // 标智客高级编辑页：每个图层一个独立 svg，第一个是背景层
    const wrapper = document.querySelector('.svg-canvas-wrapper');
    if (!wrapper) {
      throw new Error('没有 .svg-canvas-wrapper，当前不是标智客的高级编辑页；生成页请用 /guide 页面下载');
    }
    const svgs = [...wrapper.children].filter((e) => e.nodeName.toLowerCase() === 'svg');
    if (svgs.length === 0) {
      throw new Error('编辑区里一个图层都没有，请先选中一个 LOGO 再下载');
    }
    return { base: svgs[0], layers: svgs.slice(1) };
  }

  const editor = guideEditor();
  if (!editor) {
    throw new Error('没有读到预览画布。请先点击生成结果里的 LOGO 图样，等预览面板出来后，再点“处理并下载”');
  }
  return { base: editor.svg, layers: [] };
}

// 把多图层合并成一个 svg 的克隆节点。全程只读原页面、不改动它（老代码会把页面上的图层搬走，导致导出后页面空白）
function mergeLayers(base, layers) {
  const merged = base.cloneNode(true);
  let defs = merged.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS(SVG_NS, 'defs');
    merged.insertBefore(defs, merged.firstChild);
  }
  const known = new Set([...defs.children].map((d) => String(d.id || '')));
  for (const layer of layers) {
    const liveDefs = layer.querySelector('defs');
    if (liveDefs) {
      // 每个图层都带一份同名滤镜，合并时必须按 id 去重，否则成品里会出现十几个重复 id
      for (const node of liveDefs.children) {
        const id = String(node.id || '');
        if (id && known.has(id)) {
          continue;
        }
        if (id) known.add(id);
        defs.appendChild(node.cloneNode(true));
      }
    }
    for (const child of layer.children) {
      const tag = child.nodeName.toLowerCase();
      if (tag === 'defs' || isWatermarkEl(child)) {
        continue;
      }
      merged.appendChild(child.cloneNode(true));
    }
  }
  return merged;
}

/* ===================== 导出主流程 ===================== */

function exportLogo(req, resp) {
  const tab_type = req.tab_type;
  const conf = conf_list[tab_type];
  if (!conf) {
    resp('插件里没有这个页面的配置，请刷新页面后重试');
    return;
  }

  const raw = String(req.widthset == null ? '' : req.widthset).trim();
  const width = raw === '' ? conf.default : parseInt(raw, 10);
  if (!Number.isFinite(width)) {
    resp(`宽度请填写数字，留空则用默认值 ${conf.default}`);
    return;
  }
  if (width < conf.min || width > conf.max) {
    resp(`宽度应该介于${conf.min}~${conf.max}`);
    return;
  }
  const padRatio = Math.min(1, Math.max(0, (parseFloat(req.padpct) || 0) / 100));
  const align = req.padalign === 'left' || req.padalign === 'right' ? req.padalign : 'center';
  const cut = !!(req.cutlogo || req.cutsquare);

  const src = collectSources(tab_type);
  // 动画面板停在第一帧时，图层上会留下 opacity: 0，直接导出就会发现文字/图标"丢了"，这里先数出来
  const hiddenLayers = [src.base, ...src.layers].reduce((total, svg) => total + [...svg.children].filter((e) => {
    const tag = e.nodeName.toLowerCase();
    if (SKIP_TAGS.indexOf(tag) >= 0 || isBackgroundEl(e) || isWatermarkEl(e)) {
      return false;
    }
    return parseFloat(getComputedStyle(e).opacity) === 0;
  }).length, 0);
  const canvas = parseCanvasBox(src.base);
  if (!canvas) {
    resp('画布缺少 viewBox / width / height，插件无法确定导出尺寸，请刷新页面后重试');
    return;
  }

  const merged = mergeLayers(src.base, src.layers);

  // 水印：标智客生成页的水印是 svg 外的 div 覆盖层，标小智的是 svg 内的 rect.watermarklayer，这里两种都清掉
  [...merged.querySelectorAll('[id],[class]')]
    .filter((e) => isWatermarkEl(e))
    .forEach((e) => e.remove());

  const bg = [...merged.children].find((e) => isBackgroundEl(e)) || merged.querySelector('#background');
  if (!req.keepbg && bg) {
    bg.remove();
  }

  // 把散落在页面里的渐变/滤镜定义补进导出文件
  const unresolved = inlineMissingDefs(merged);

  let box = canvas;
  if (req.cutlogo) {
    box = paddedBox(contentBox(src.base, src.layers), padRatio);
  } else if (req.cutsquare) {
    box = squareCanvasBox(paddedBox(contentBox(src.base, src.layers), padRatio), align);
  }
  if (!box || !(box.w > 0) || !(box.h > 0)) {
    resp('没有取到有效的裁剪范围，请刷新页面后重试');
    return;
  }
  if (cut && req.keepbg) {
    fitBackground([...merged.children].find((e) => isBackgroundEl(e)), box);
  }

  const height = parseFloat((width * box.h / box.w).toFixed(2));
  merged.setAttribute('viewBox', `${num(box.x)} ${num(box.y)} ${num(box.w)} ${num(box.h)}`);
  merged.setAttribute('width', num(width));
  merged.setAttribute('height', num(height));
  merged.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  merged.removeAttribute('style');

  let markup = plainNumbers(new XMLSerializer().serializeToString(merged));
  // 图片素材的地址可能是 //cdn.xxx/yyy 这种协议相对写法，单独打开 svg 时加载不出来
  markup = markup.replace(/xlink:href="\/\//g, 'xlink:href="https://').replace(/ href="\/\//g, ' href="https://');
  const isBlob = markup.indexOf('href="blob:') >= 0;

  const notes = [
    `${width}×${height}`,
    req.keepbg ? '保留背景' : '透明背景',
    req.cutlogo ? '按内容裁剪' : req.cutsquare ? '裁剪为正方形' : '按画布尺寸'
  ];
  if (padRatio > 0) {
    notes.push(`留白${Math.round(padRatio * 100)}%`);
  }
  if (req.cutsquare) {
    notes.push(`位置${align === 'left' ? '靠左' : align === 'right' ? '靠右' : '居中'}`);
  }
  if (unresolved.length > 0) {
    notes.push(`有 ${unresolved.length} 个引用（${unresolved.slice(0, 3).join(', ')}）在页面里也找不到定义，对应效果可能显示不出来`);
  }
  if (isBlob) {
    notes.push('素材地址是页面内的 blob 链接，可能显示不出来');
  }
  if (hiddenLayers > 0) {
    notes.push(`有 ${hiddenLayers} 个图层现在是透明的，成品里不会显示；一般是点过“动画”后停在第一帧，把动画播完或选回无动画再导出`);
  }

  if (req.format === 'png') {
    if (width > PNG_MAX_SIDE || height > PNG_MAX_SIDE || width * height > PNG_MAX_PIXELS) {
      // 按当前宽高比反推还能用的最大宽度，直接告诉用户该填多少，而不是偷偷给他一个 SVG
      const maxW = Math.floor(Math.min(
        PNG_MAX_SIDE,
        PNG_MAX_SIDE * box.w / box.h,
        Math.sqrt(PNG_MAX_PIXELS * box.w / box.h)
      ));
      resp(`这个尺寸转不了位图：${width}×${height}（约 ${Math.round(width * height / 10000)} 万像素），超过单边 ${PNG_MAX_SIDE} 或总面积 ${Math.round(PNG_MAX_PIXELS / 10000)} 万像素的上限。当前比例下宽度最大可以用 ${maxW}，或者把格式改回 SVG 下载矢量文件。`);
      return false;
    }
    rasterizePng(markup, width, height,
      (blob) => {
        dlBlob(blob, 'free_canvas下载.png');
        resp('PNG 导出成功！' + notes.join('，'));
      },
      (msg) => {
        resp(msg + '。这次没有下载文件，可以换回 SVG 格式导出矢量文件。');
      });
    return true; // 位图是异步的，让 Chrome 保持消息通道
  }

  dl(markup);
  resp('导出成功！' + notes.join('，'));
  return false;
}

if (isGuidePage() && GUIDE_UNMASK) {
  unmaskGuideLogin();
}

chrome.runtime.onMessage.addListener((req, sender, resp) => {
  // popup 打开时先问一句当前是什么页面
  if (req.preDeal) {
    if (isGuidePage()) {
      try {
        resp(guideEditor() ? 'guide' : 'guide-empty');
      } catch (e) {
        resp('guide-error');
      }
      return;
    }
    if (/logosc\.cn$/i.test(location.hostname)) {
      resp(document.querySelector('.card__upper') ? 'logo' : 'unknown');
      return;
    }
    if (/logomaker\.com\.cn$/i.test(location.hostname)) {
      resp(document.querySelector('.svg-canvas-wrapper') ? 'logo' : 'unknown');
      return;
    }
    resp('unknown');
    return;
  }

  try {
    return exportLogo(req, resp); // 位图导出是异步的，返回 true 保持消息通道
  } catch (err) {
    // 任何异常都要把原因回给 popup，否则界面上只会显示一个 undefined
    resp('处理失败：' + ((err && err.message) || err));
  }
  return false;
})

function dl(content) {
  const el = document.createElement("a");
  el.setAttribute('download', 'free_canvas下载.svg');
  const blob = new Blob([content])
  el.setAttribute('href', URL.createObjectURL(blob));
  el.style.display = 'none';
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
}
