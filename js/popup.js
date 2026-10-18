let tab_type = null, tab_id = null;
let type_list = [
  {
    'name': '标小智',
    'nname': 'bxz',
    'url': 'https://www.logosc.cn/edit',
    'placeholder': "输入宽度(34~13600,默认680像素)"
  },
  {
    'name': '标智客',
    'nname': 'bzk1',
    'url': 'https://www.logomaker.com.cn/editor?case_id',
    'placeholder': "输入宽度(40~16000,默认800像素,可选)"
  },
  {
    'name': '标智客·生成页',
    'nname': 'bzk2',
    'url': 'https://www.logomaker.com.cn/guide',
    'placeholder': "输入宽度(40~16000,默认800像素,可选)"
  }
]

chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  tab_id = tabs[0].id;
  const url = tabs[0].url || '';
  for (let u in type_list) {
    if (url.indexOf(type_list[u].url) === 0) {
      tab_type = parseInt(u);
      break;
    }
  }
  dealPage();
  if (tab_type !== null) {
    preDeal(tab_id);
  }
})

// PNG 是浏览器现场把每个像素画出来，尺寸大了会卡一会儿，这里提前给一句提示
const updateSlowTip = () => {
  const tip = document.getElementById("slowtip");
  const fmt = document.querySelector('input[name="format"]:checked');
  const raw = document.getElementById("widthset").value.trim();
  const w = raw === '' ? 0 : parseInt(raw, 10);
  if (!fmt || fmt.value !== 'png' || !Number.isFinite(w) || w < 4000) {
    tip.style.display = "none";
    return;
  }
  tip.innerText = w >= 8000
    ? "尺寸较大，转 PNG 预计要十秒上下，期间请留在当前标签页耐心等待"
    : "尺寸较大，转 PNG 可能要几秒，请稍候";
  tip.style.display = "block";
}

document.getElementById("widthset").addEventListener("input", updateSlowTip);
document.querySelectorAll('input[name="format"]').forEach((r) => r.addEventListener("change", updateSlowTip));

const dealPage = () => {
  if (tab_type !== null) {
    document.getElementById("mainbox").style.display = "block";
    document.getElementById("widthset").setAttribute("placeholder", type_list[tab_type].placeholder);
    // 三个页面现在都是同一套裁剪算法（按画布 viewBox 和实际内容算，不要求取消编组、不要求缩放 100%）
    document.getElementById("cutlogodiv").style.display = "block";
    updateSlowTip();
    if (tab_type === 2) {
      // 生成页默认按内容裁剪，否则导出的是 800x600 整张画布，四周一大片透明
      document.getElementById("cutlogo").checked = true;
    }
  } else {
    document.getElementById("ans").innerText = "暂时没有发现可以下载的LOGO或者海报";
  }
}

function preDeal(tabId) {
  chrome.tabs.sendMessage(tabId, {'preDeal': true}, (resp) => {
    if (chrome.runtime.lastError) {
      document.getElementById("ans").innerText = "页面还没加载完或者插件未注入，请刷新页面后重试";
      return;
    }
    if (resp === 'unknown') {
      document.getElementById("ans").innerText = "当前页面没有可下载的画布，请打开LOGO预览或进入高级编辑页";
    } else if (resp === 'guide-empty' || resp === 'guide-error') {
      document.getElementById("ans").innerText = "先点击生成结果里的 LOGO 图样，把预览面板打开后再点“处理并下载”";
    }
  })
}

document.getElementById("execute").addEventListener("click", () => {
  if (tab_type === null) {
    document.getElementById("ans").innerText = "当前页面不支持下载";
    return;
  }
  const align = document.querySelector('input[name="padalign"]:checked');
  const fmt = document.querySelector('input[name="format"]:checked');
  let opt = {
    'tab_type': tab_type,
    'widthset': document.getElementById("widthset").value,
    'keepbg': document.getElementById('keepbg').checked,
    'cutlogo': document.getElementById('cutlogo').checked,
    'cutsquare': document.getElementById("cutsquare").checked,
    'padpct': document.getElementById("padpct").value,
    'padalign': align ? align.value : 'center',
    'format': fmt ? fmt.value : 'svg'
  }
  if (opt.format === 'png') {
    document.getElementById("ans").innerText = "正在转成位图，请稍候…";
  }
  chrome.tabs.sendMessage(tab_id, opt, (resp) => {
      if (chrome.runtime.lastError) {
        document.getElementById("ans").innerText = "与页面通信失败，请刷新LOGO页面后重试";
        return;
      }
      document.getElementById("ans").innerText = resp === undefined ? '处理失败：页面无响应，请刷新页面后重试' : resp;
  })
})
