console.log(`%c${'欢迎使用Free Logo插件.\n项目地址:https://github.com/quarkape/free_logo.git.\n还请给个star,欢迎fork~'}`, 'font-size: 20px;color: #9c26b0;font-weight: bold;')

chrome.runtime.onMessage.addListener((req, sender, resp) => {
  console.log('processing...')
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
  let widthset = req.widthset === '' ? 620 : parseInt(req.widthset);
  let keepbg = req.keepbg;
  if (widthset < 62 || widthset > 6200) {
    resp('请确保值介于62~6200');
    return;
  }
  const svg_part = document.getElementsByTagName("logomaker-logo-editor")[0].shadowRoot.lastChild.childNodes[0].childNodes[0].children[0];
  const svg_part_copy = svg_part.cloneNode(true);
  svg_part_copy.setAttribute("width", widthset);
  svg_part_copy.setAttribute("height", parseInt(widthset * 3 / 4));
  const bg = svg_part_copy.children[1];
  if (bg.nodeName === 'g' || bg.id === 'background') {
    if (!keepbg) {
      svg_part_copy.removeChild(bg);
    }
  }
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