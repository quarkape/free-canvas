// console
console.log(`%c${'----------\n欢迎使用Free Logo插件.\n项目地址:https://github.com/quarkape/Free_Logo.\n还请给个star,欢迎fork~\n----------'}`, 'font-size: 20px;color: #9c26b0;font-weight: bold;')

let conf_list = [
  {
    'name': 'bxz', // 网站简称
    'min': 34, // 允许的宽度最小值，可以更改
    'max': 6800, // 允许的宽度最大值，可以更改
    'default': 680, // 默认的宽度值，可以更改，当不输入宽度值得时候，默认用这个值
    'w': 34, // 宽高比的宽
    'h': 25, // 宽高比的高
    'bgpos': 0, // 背景的位置
    'bgty': 'rect', // 背景的类型
    'bgnm': 'background', // 背景的id名
    'wmpos': 1, // 水印的位置
    'wmty': 'rect', // 水印的类型
    'wmnm': 'watermark' // 水印的名称
  }, {
    'name': 'bzk0',
    'min': 31,
    'max': 6200,
    'default': 620,
    'w': 4,
    'h': 3,
    'bgpos': 1,
    'bgty': 'g',
    'bgnm': 'background'
  }, {
    'name': 'bzk1',
    'min': 40,
    'max': 8000,
    'default': 800,
    'w': 4,
    'h': 3,
    'bgpos': 1,
    'bgty': 'g',
    'bgnm': 'background'
  }
]

chrome.runtime.onMessage.addListener((req, sender, resp) => {
  // 处理登录框
  if (req.del) {
    const logincover = document.getElementsByClassName("el-scrollbar__view")[0].children[7];
    if (!logincover.className) {
      logincover.parentNode.removeChild(logincover);
      resp('登录框去除成功!');
    } else {
      resp('登录框似乎已经去除了。如有误判，烦请到github/gitee上面提issue~');
    }
    return;
  }

  // 处理自定义参数
  let tab_type = req.tab_type;
  let widthset = req.widthset === '' ? (conf_list[tab_type].default) : parseInt(req.widthset);
  let keepbg = req.keepbg;

  // 检查参数
  if (widthset < conf_list[tab_type].min || widthset > conf_list[tab_type].max) {
    resp(`宽度应该介于${conf_list[tab_type].min}~${conf_list[tab_type].max}`);
    return;
  }
  
  // 获取svg节点
  let svg_part = null;
  switch (tab_type) {
    case 0:
      svg_part = document.getElementsByClassName("card__upper")[0].parentNode.childNodes[0].children[1];
      break;
    case 1:
      svg_part = document.getElementsByTagName("logomaker-logo-editor")[0].shadowRoot.lastChild.childNodes[0].childNodes[0].children[0];
      break;
    case 2:
      svg_part = document.getElementById('stage_canvas').children[1];
      break;
  }

  // 克隆节点，防止污染原节点
  const svg_part_copy = svg_part.cloneNode(true);

  // 修改尺寸
  svg_part_copy.setAttribute("width", widthset);
  svg_part_copy.setAttribute("height", parseInt(widthset * conf_list[tab_type].h / conf_list[tab_type].w));

  // 去水印
  if (conf_list[tab_type].wmpos) {
    let wm = svg_part_copy.children[conf_list[tab_type].wmpos];
    if (wm.nodeName === conf_list[tab_type].wmty && (wm.id === conf_list[tab_type].wmnm || wm.className === conf_list[tab_type].wmnm)) {
      svg_part_copy.removeChild(wm);
    }
  }

  // 操作背景
  if (!keepbg) {
    let bg = svg_part_copy.children[conf_list[tab_type].bgnm];
    if (bg.nodeName === conf_list[tab_type].bgty && (bg.id === conf_list[tab_type].bgnm || bg.className === conf_list[tab_type].bgnm)) {
      svg_part_copy.removeChild(bg);
    }
  }

  // 导出svg文件
  dl(svg_part_copy.outerHTML);
  resp('操作成功')
})

function dl(content) {
  const el = document.createElement("a");
  el.setAttribute('download', 'free_logo.svg');
  const blob = new Blob([content])
  el.setAttribute('href', URL.createObjectURL(blob));
  el.style.display = 'none';
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
}