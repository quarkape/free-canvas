document.getElementById("execute").addEventListener("click", () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const url = tabs[0].url;
    let opt = {};
    if (url.indexOf('https://www.logosc.cn/edit') === 0) {
      opt.uname = 'bxz';
    } else if (url.indexOf('https://www.logomaker.com.cn/guide#/generate') === 0) {
      opt.uname = 'bzk';
    } else {
      document.getElementById("ans").innerText = "当前网站或页面不适合使用该插件。如果判断有误，烦请到github上面提issue~";
      return;
    }
    opt.del = false;
    opt.widthset = document.getElementById("widthset").value;
    opt.keepbg = document.getElementById('keepbg').checked;
    chrome.tabs.sendMessage(tabs[0].id, opt, (resp) => {
        document.getElementById("ans").innerText = resp;
    })
  })
})

document.getElementById("guidence").addEventListener("click", () => {
  window.open("https://github.com/quarkape/free_logo.git");
})

document.getElementById("deletecover").addEventListener("click", () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const url = tabs[0].url;
    if (url.indexOf('https://www.logomaker.com.cn/guide#/generate') === -1) {
      document.getElementById("ans").innerText = "当前页面并不存在登录框。如果判断有误，烦请到github上面提issue~";
      return;
    }
    let opt = {
      'del': true
    }
    chrome.tabs.sendMessage(tabs[0].id, opt, (resp) => {
        document.getElementById("ans").innerText = resp;
    })
  })
})