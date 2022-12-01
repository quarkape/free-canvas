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
    'bgkey': 'baseVal',
    'bgkey2': 'animVal',
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
const pat = /(?<=translate\()(.+?)(?=\))/;
const patBox = /(?<=translate\()(.+?)(?=px\))/;

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
  let cutlogo = req.cutlogo;

  // 检查参数
  if (widthset < conf_list[tab_type].min || widthset > conf_list[tab_type].max) {
    resp(`宽度应该介于${conf_list[tab_type].min}~${conf_list[tab_type].max}`);
    return;
  }
  
  // 获取svg节点
  let svg_part = null;
  let svg_part_copy = null;

  // 克隆节点，防止污染原节点；将节点插入到文档中，才能使用getBoundingClientRect()函数
  switch (tab_type) {
    case 0:
      svg_part = document.getElementsByClassName("card__upper")[0].parentNode.childNodes[0].children[1];
      svg_part_copy = svg_part.cloneNode(true);
      // document.getElementsByClassName("card__upper")[0].parentNode.childNodes[0].appendChild(svg_part_copy);
      break;
    case 1:
      svg_part = document.getElementsByTagName("logomaker-logo-editor")[0].shadowRoot.lastChild.childNodes[0].childNodes[0].children[0];
      svg_part_copy = svg_part.cloneNode(true);
      // document.getElementsByTagName("logomaker-logo-editor")[0].shadowRoot.lastChild.childNodes[0].childNodes[0].appendChild(svg_part_copy);
      break;
    case 2:
      svg_part = document.getElementById('stage_canvas').children[1];
      svg_part_copy = svg_part.cloneNode(true);
      document.getElementById('stage_canvas').appendChild(svg_part_copy);
      break;
  }

  // 克隆节点透明
  svg_part_copy.style.opacity = "0";


  // 去水印
  if (conf_list[tab_type].wmpos) {
    let wm = svg_part_copy.children[conf_list[tab_type].wmpos];
    if (wm.nodeName === conf_list[tab_type].wmty && (wm.id === conf_list[tab_type].wmnm || wm.className === conf_list[tab_type].wmnm)) {
      svg_part_copy.removeChild(wm);
    }
  }

  // 操作背景
  if (!keepbg) {
    console.log('enter')
    let bg = svg_part_copy.children[conf_list[tab_type].bgpos];
    console.log('bg:', bg)
    console.log('pd:', bg.nodeName, conf_list[tab_type].bgty, bg.className, conf_list[tab_type].bgnm[conf_list[tab_type].bgkey])
    if (bg.nodeName === conf_list[tab_type].bgty && (conf_list[tab_type].bgnm === (conf_list[tab_type].bgty === 'rect' ? bg.id[conf_list[tab_type].bgkey] : bg.id) || conf_list[tab_type].bgnm === (conf_list[tab_type].bgty === 'rect' ? bg.className[conf_list[tab_type].bgkey] : bg.className))) {
      console.log('yes')
      svg_part_copy.removeChild(bg);
    }
  }

  // 去掉无用区域，仅适用于标智客登陆后的类型
  if (tab_type === 2 && cutlogo) {
    let svgBoxNodes = document.getElementById("rectBox");
    let edgeArr = calcEdge(svg_part_copy, svgBoxNodes);
    dealCutFit(svg_part_copy, edgeArr);
  } else {
    // 修改尺寸
    svg_part_copy.setAttribute("width", widthset);
    svg_part_copy.setAttribute("height", parseInt(widthset * conf_list[tab_type].h / conf_list[tab_type].w));
  }

  // 计算LOGO的上下左右边界
  // 仅适用于登陆后的标智客使用
  function calcEdge(svgNode, svgBoxNodes) {
    let svgRect = svgNode.getBoundingClientRect();
    let leftMin = Number.MAX_SAFE_INTEGER, topMin = Number.MAX_SAFE_INTEGER;
    let rightMax = Number.MIN_SAFE_INTEGER, bottomMax = Number.MIN_SAFE_INTEGER;
    let nodes = svgNode.children;
    let boxNodes = svgBoxNodes.children;
    let placeCount = -1;
    // 判断是否存在
    // 水印+def是必须算的节点
    let nodesNum = keepbg ? 2 : 1;
    console.log(nodes.length, nodesNum, boxNodes.length)
    if ((nodes.length - nodesNum) !== boxNodes.length) {
      resp('检测到插件不适用于此logo，请检查logo中是否有文字素材。如果有，请单击文字素材，然后点击左上角取消编组，重复此过程直到logo中所有文字素材都取消了编组。如果仍无法处理，请到github/gitee上面提issue或者反馈给我~');
      // document.getElementById('stage_canvas').removeChild(svg_part_copy);
      return;
    }
    // 排除一些非g标签对index的影响
    for (let index=0;index<nodes.length;index++) {
      // 计算上下左右边界
      if ((nodes[index].id).indexOf("shape_") === 0) {
        placeCount++;
        let transAttr = nodes[index].getAttribute("transform");
        let transl = transAttr.match(pat)[0].split(",");
        let transLeft = parseFloat(transl[0]);
        let transTop = parseFloat(transl[1]);
        let transRight = 0, transBottom = 0;

        // 消除rect对实际宽高的影响
        let innerSvgNodes = nodes[index].firstChild.children;

        // 部分组件的参考点不是左上角，需要对比处理
        // 这里要注意index+1，因为克隆的那个背景被去掉了，因此要在克隆的节点的基础上加上1才能得到原始节点的数据
        let boxTrans = boxNodes[placeCount].style.transform.match(patBox)[0].split(",");
        // 在做对比看参考点的时候，用原来的的svg与原来的box总比较，但是最后是在克隆的svg上面做修改
        // 如果参考点x为0（假设此时y的参考点也为0）
        // 这里的判断不太科学，但是确实没有更加理想的方法了
        if (Math.abs(parseInt(transLeft) - parseInt(boxTrans[0])) <= 1) {
          if (innerSvgNodes[0].nodeName !== "rect") {
            // 第一层没有第二层有
            let finalSvgNodes = innerSvgNodes[0].children;
            if (finalSvgNodes.length > 1 && finalSvgNodes[0].nodeName === "rect") {
              let gRect = finalSvgNodes[1].getBoundingClientRect();
              transLeft = gRect.left - svgRect.left;
              transTop = gRect.top - svgRect.top;
              // 上面已经计算了部分内容，下面只需要加上width就够了
              transRight = transLeft + gRect.width;
              transBottom = transTop + gRect.height;
            } else {
              // 第一层没有第二层也没有
              transRight = transLeft + parseFloat(innerSvgNodes[1].getAttribute("width"));
              transBottom = transTop + parseFloat(innerSvgNodes[1].getAttribute("height"));
            }
          } else {
            // 第一层有
            transRight = transLeft + parseFloat(innerSvgNodes[1].getAttribute("width"));
            transBottom = transTop + parseFloat(innerSvgNodes[1].getAttribute("height"));
          }
        } else { // 参考点x不为0
          if (innerSvgNodes[0].nodeName !== "rect") {
            let finalSvgNodes = innerSvgNodes[0].children;
            // 第一层没有第二层有
            if (finalSvgNodes.length > 1 && finalSvgNodes[0].nodeName === "rect") {
              let gRect = innerSvgNodes[0].lastChild.getBoundingClientRect();
              transLeft = gRect.left - svgRect.left;
              transTop = gRect.top - svgRect.top;
              // 上面已经计算了部分内容，下面只需要加上width就够了
              transRight = transLeft + gRect.width;
              transBottom = transTop + gRect.height;
            } else {
              // 第一层没有第二层也没有
              let itemRect = nodes[index].getBoundingClientRect();
              transLeft = itemRect.left - svgRect.left;
              transTop = itemRect.top - svgRect.top;
              transRight = transLeft + itemRect.width;
              transBottom = transTop + itemRect.height;
            }
          } else {
            // 第一层有
            let itemRect = nodes[index].getBoundingClientRect();
            transLeft = itemRect.left - svgRect.left;
            transTop = itemRect.top - svgRect.top;
            transRight = transLeft + itemRect.width;
            transBottom = transTop + itemRect.height;
          }
        }
        if (transLeft < leftMin) {
          leftMin = transLeft;
        }
        if (transTop < topMin) {
          topMin = transTop;
        }
        if (transRight > rightMax) {
          rightMax = transRight;
        }
        if (transBottom > bottomMax) {
          bottomMax = transBottom;
        }
      }
    }
    return {
      'leftMin': leftMin,
      'topMin': topMin,
      'rightMax': rightMax,
      'bottomMax': bottomMax
    }
  }
  
  // 支持根据LOGO实际内容智能裁剪
  function dealCutFit(svgNode, edgeArr) {
    let nodes = svgNode.children;
    // 移动所有元素的位置至左上角
    for (let i of nodes) {
      if ((i.id).indexOf("shape_") === 0) {
        let transAttr = i.getAttribute("transform");
        let transl = transAttr.match(pat)[0].split(",");
        let transLeft = parseFloat(transl[0]);
        let transTop = parseFloat(transl[1]);
        let rep = `${(transLeft-edgeArr.leftMin).toFixed(11)},${(transTop - edgeArr.topMin).toFixed(11)}`;
        transAttr = transAttr.replace(pat, rep);
        i.setAttribute("transform", transAttr);
      }
    }
    // 移动背景图片位置
    let bg = svgNode.children[conf_list[tab_type].bgpos];
    if (bg.nodeName === conf_list[tab_type].bgty && (bg.id === conf_list[tab_type].bgnm || bg.className === conf_list[tab_type].bgnm)) {
      bg.setAttribute("transform", `translate(${-edgeArr.leftMin} ${-edgeArr.topMin})`)
    }
    // 计算LOGO画布尺寸
    let svgWidth = edgeArr.rightMax - edgeArr.leftMin;
    let svgHeight = edgeArr.bottomMax - edgeArr.topMin;
    // 修改画布尺寸
    svgNode.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    svgNode.setAttribute("width", widthset);
    svgNode.setAttribute("height", widthset * svgHeight / svgWidth);
  }

  // 支持裁剪为正方形LOGO，LOOG自动居中
  function dealCutSquare(svgNode, widthset) {
    // 计算LOGO画布尺寸，决定正方形的边长
    // let svgWidth = edgeArr.rightMax - edgeArr.leftMin;
    // let svgHeight = edgeArr.bottomMax - edgeArr.topMin;
    // let logoLen = Math.max(svgWidth, svgHeight);
  }

  // 导出svg文件
  svg_part_copy.style = "";
  dl(svg_part_copy.outerHTML);
  // 将克隆的节点删除
  switch (tab_type) {
    case 0:
      // document.getElementsByClassName("card__upper")[0].parentNode.childNodes[0].removeChild(svg_part_copy);
      break;
    case 1:
      // document.getElementsByTagName("logomaker-logo-editor")[0].shadowRoot.lastChild.childNodes[0].childNodes[0].removeChild(svg_part_copy);
      break;
    case 2:
      document.getElementById('stage_canvas').removeChild(svg_part_copy);
      break;
  }
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