console.log(`%c${'欢迎使用Free Logo插件.\n项目地址:https://github.com/quarkape/Free_Logo.git.\n还请给个star,欢迎fork~'}`, 'font-size: 20px;color: #9c26b0;font-weight: bold;')

chrome.runtime.onMessage.addListener((req, sender, resp) => {
  console.log(req)
  console.log('processing...')
  // is deleting login cover
  if (req.del) {
    const logincover = document.getElementsByClassName("el-scrollbar__view")[0].children[7];
    if (!logincover.className) {
      logincover.parentNode.removeChild(logincover);
      console.log('succeed to remove login cover...')
      resp('登录框去除成功~');
    } else {
      resp('登录框好像已经去除了,如果没有,请前往github上面提issue或者联系我~');
    }
    return;
  }
  // is bzk
  const bxz = {
    'min': 34,
    'max': 6800,
    'default': 680,
    'w': 34,
    'h': 25
  }
  const bzk = {
    'min': 31,
    'max': 6200,
    'default': 620,
    'w': 4,
    'h': 3
  }

  let uname = req.uname;
  let widthset = req.widthset === '' ? (uname === 'bxz' ? bxz.default : bzk.default) : parseInt(req.widthset);
  let keepbg = req.keepbg;
  if (uname === 'bxz') {
    if (widthset < bxz.min || widthset > bxz.max) {
      resp(`宽度应该介于${bxz.min}~${bxz.max}`);
      return;
    }
  } else if (uname === 'bzk') {
    if (widthset < bzk.min || widthset > bzk.max) {
      resp(`宽度应该介于${bzk.min}~${bzk.max}`);
      return;
    }
  } else {
    resp('意外的错误，烦请到github上面提issue~')
    return;
  }
  
  let svg_part = null;
  if (uname === 'bxz') {
    svg_part = document.getElementsByClassName("card__upper")[0].parentNode.childNodes[0].children[1];
  } else {
    svg_part = document.getElementsByTagName("logomaker-logo-editor")[0].shadowRoot.lastChild.childNodes[0].childNodes[0].children[0];
  }
  console.log(svg_part)
  const svg_part_copy = svg_part.cloneNode(true);
  svg_part_copy.setAttribute("width", widthset);
  svg_part_copy.setAttribute("height", parseInt(widthset * (uname === 'bxz' ? bxz.w : bzk.w) / (uname === 'bxz' ? bxz.h : bzk.h)));
  let bg = null;
  if (uname === 'bxz') {
    bg = svg_part_copy.children[0];
    if (bg.nodeName === 'rect' || bg.className === 'background') {
      if (!keepbg) {
        svg_part_copy.removeChild(bg);
      }
    }
    const wm = svg_part_copy.children[1];
    if (wm.nodeName === 'rect' || wm.classname === 'watermarklayer') {
      svg_part_copy.removeChild(wm);
    }
  } else {
    bg = svg_part_copy.children[1];
    if (bg.nodeName === 'g' || bg.id === 'background') {
      if (!keepbg) {
        svg_part_copy.removeChild(bg);
      }
    }
  }

  // final
  dl(svg_part_copy.outerHTML);
  console.log('succeed!')
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