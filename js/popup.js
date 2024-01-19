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
  }
]

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
  preDeal(tab_id);

})

const dealPage = () => {
  if (tab_type !== null) {
    document.getElementById("mainbox").style.display = "block";
  } else {
    document.getElementById("ans").innerText = "暂时没有发现可以下载的LOGO或者海报";
  }
  document.getElementById("widthset").setAttribute("placeholder", type_list[tab_type].placeholder);
  
  if (tab_type === 1) {
    document.getElementById("cutlogodiv").style.display = "block";
  }
}

function preDeal(tabId) {
  chrome.tabs.sendMessage(tabId, {'preDeal': true}, (resp) => {
    if (resp === 'poster') {
      document.getElementById("cutlogodiv").style.display = "none";
      document.getElementById("keepbgdiv").style.display = "none";
    }
  })
}

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