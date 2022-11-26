document.getElementById("execute").addEventListener("click", () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const url = tabs[0].url;
    if (url.indexOf('https://www.logomaker.com.cn/guide#/generate') === -1) {
      document.getElementById("ans").innerText = "当前页面并不适合使用该插件，请点击上方使用教程查看本插件适用网站与页面";
      return;
    }
    let opt = {
      'widthset': document.getElementById("widthset").value,
      'keepbg': document.getElementById('keepbg').checked
    }
    chrome.tabs.sendMessage(tabs[0].id, opt, (resp) => {
        document.getElementById("ans").innerText = resp;
    })
  })
  
})
document.getElementById("guidence").addEventListener("click", () => {
  window.open("https://github.com/quarkape/free_logo.git");
})