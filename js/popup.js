let tab_type = null, tab_id = null;
let type_list = [
  {
    'name': '标小智',
    'nname': 'bxz',
    'url': 'https://www.logosc.cn/edit'
  }, {
    'name': '标智客(未登录)',
    'nname': 'bzk0',
    'url': 'https://www.logomaker.com.cn/guide#/generate'
  }, {
    'name': '标智客(已登录)',
    'nname': 'bzk1',
    'url': 'https://www.logomaker.com.cn/editor?case_id'
  }
]

// 判断当前页面类型
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  tab_id = tabs[0].id;
  const url = tabs[0].url;
  for (let u in type_list) {
    if (url.indexOf(type_list[u].url) === 0) {
      tab_type = parseInt(u);
      break;
    }
  }
  dealPage();
})

// 页面预处理
const dealPage = () => {
  // 提示是否适合使用插件
  if (tab_type !== null) {
    document.getElementById("mainbox").style.display = "block";
  } else {
    document.getElementById("ans").innerText = "请在LOGO编辑页面使用本插件。\n如有误判，烦请到github/gitee上面提issue~";
  }
  // 当前页面提示
  document.getElementById("curpage").innerText = tab_type === null ? '' : `当前页面：【${type_list[tab_type].name}】`;
  document.getElementById("mainbox").children[tab_type+1].style.display = "block";
  // 去除登录框按钮是否显示
  if (tab_type === 1) {
    document.getElementById("deletecover").style.display = "block";
  }
  // 是否显示智能裁剪
  if (tab_type === 2) {
    document.getElementById("cutlogodiv").style.display = "block";
  }
}

// 跳转到项目地址
document.getElementById("guidence").addEventListener("click", () => {
  window.open("https://github.com/quarkape/free_logo.git");
})

// 处理登录框
document.getElementById("deletecover").addEventListener("click", () => {
  chrome.tabs.sendMessage(tab_id, {'del': true}, (resp) => {
      document.getElementById("ans").innerText = resp;
  })
})

// 开始处理
document.getElementById("execute").addEventListener("click", () => {
  let opt = {
    'tab_type': tab_type,
    'widthset': document.getElementById("widthset").value,
    'keepbg': document.getElementById('keepbg').checked,
    'cutlogo': document.getElementById('cutlogo').checked,
    'cutsquare': document.getElementById("cutsquare").checked
  }
  chrome.tabs.sendMessage(tab_id, opt, (resp) => {
      document.getElementById("ans").innerText = resp;
  })
})