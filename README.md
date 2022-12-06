#  Free Canvas  v4.1.0

<img src="https://raw.githubusercontent.com/quarkape/free-canvas/main/img/free-canvas.png" alt="image" style="height:100px" />

### **快速**、**免费**下载无水印、高清LOGO、海报、banner等！

遇到问题，请提issue或反馈；感谢B友@拾光探长在版本更新后的测试；欢迎star或fork以跟进后续功能更新~

*:warning: 提示：LOGO或海报很多图片、字体或者素材都有版权，帖子和插件仅供技术交流，插件下载的LOGO和海报在官方未授权时请勿商用，由未授权而商用导致的版权纠纷问题，由LOGO和海报使用者承担所有责任。*



## :computer: 适用网站

[![](https://img.shields.io/static/v1?label=标小智&message=https://www.logosc.cn/&color=666&labelColor=0081ff)](https://www.logosc.cn/)&emsp;[![](https://img.shields.io/static/v1?label=标智客&message=https://www.logomaker.com.cn/&color=666&labelColor=00deb4)](https://www.logomaker.com.cn/)



## 下载

- 直接下载：点击上方“Code”按钮，选择最后一项“Download ZIP”
- 项目克隆：`git clone https://github.com/quarkape/free-canvas`



## 安装

1. 将完整的项目下载下来
2. 在地址栏输入`chrome://extensions/`（Edge浏览器是`edge://extensions/`）回车，进入扩展程序管理页面
3. 打开开发者模式，并在页面找到加载已解压的扩展程序并点击，选择从解压后的本项目



## 使用

- logo导出

  1. 进入网站的LOGO编辑页面（如果弹出登录框，点击去除登录框即可）
  2. 编辑LOGO至满足需求
  3. 点击插件，根据需求填写LOGO宽度，根据需求选择是否需要保留背景或者开启智能裁剪
  4. 点击开始处理，即可开始下载
- 海报导出
  1. 登录标智客
  2. 进入标智客首页，会自动跳转页面；或者点击首页右上角工作台
  3. 在跳转后的页面最下方可以找到“运营物料应有尽有”板块
  4. 挑选相关的板块内容，点击进入
  5. 编辑好之后打开插件点击开始处理，即可开始下载



## 功能支持

|                  |      导出logo      | 去除/保留logo背景  |         logo裁剪         |      去登录框      |         导出海报         |
| :--------------: | :----------------: | :----------------: | :----------------------: | :----------------: | :----------------------: |
|      标小智      | :heavy_check_mark: | :heavy_check_mark: | :heavy_multiplication_x: |         -          | :heavy_multiplication_x: |
| 标智客（未登录） | :heavy_check_mark: | :heavy_check_mark: | :heavy_multiplication_x: | :heavy_check_mark: | :heavy_multiplication_x: |
| 标智客（已登录） | :heavy_check_mark: | :heavy_check_mark: |    :heavy_check_mark:    |         -          |    :heavy_check_mark:    |



## 常见问题

2. IE转PNG的时候，如果提示“意外的调用了属性或方法”，需要把LOGO或者海报的宽度调低一些，或者使用在线转换
3. PS转换SVG文件，有可能转换后的PNG文件有些素材的背景会变成黑色，可以使用IE转换或者在线转换
4. 如果点击立即处理后提示`undefined`，刷新LOGO编辑页面即可
5. `windows defender`提示插件压缩包有风险，解压后一般都不会再提示，不放心的小伙伴可以用相关软件检查一下
6. 智能裁剪得到的logo可能周边有些细微的空边，这常见于添加了文字的logo并且文字在logo的边界，这是组件设计问题，暂无法解决
7. 导出LOGO后页面空白，有可能是：①LOGO主体是白色的，需要保留背景才能看到LOGO主体；②设置的宽度比较大，浏览器一页无法完全显示，滚动浏览器页面或者缩放浏览器页面比例即可
8. 有的海报设置较大宽度导出后会模糊，可能因为海报里面的图片非矢量，放大会模糊



## 注意事项

1. 制作海报需要登录标智客；使用裁剪功能需要登录标智客并且需要进入高级编辑
3. 智能裁剪功能需要确保logo中没有处于编组的素材以及页面右下角的编辑比例必须是100%。已知会有编组状态的素材是：字体——书法字、标题、列表内容等（通过“添加文字”按钮添加的文字没有编组状态）。当添加了这些编组状态的素材时，你需要单击这些素材，然后点击左上角出现的取消编组按钮（重复此过程直到所有素材的编组都取消了）
5. 勾选导出1:1比例的logo的同时勾选保留背景时，为了完全填充，可能会放大背景图片
7. 插件安装完成后，请刷新LOGO编辑页面
8. 编辑LOGO的时候，不要超过给定的框



## 镜像

[![](https://img.shields.io/badge/github-freecanvas-lightgrey.svg?logo=GitHub)](https://github.com/quarkape/free-canvas)&emsp;[![](https://img.shields.io/badge/gitee-freecanvas-lightgrey.svg?logoColor=C71D23&logo=Gitee&labelColor=ffffff&color=c71d23)](https://gitee.com/quarkape/free-canvas)



## 演示视频

 [![](https://img.shields.io/badge/bilibili-演示视频(v1.0.0版本的)-red.svg?logo=Bilibili&color=00A1D6)](https://www.bilibili.com/video/BV1t84y1r71B?share_source=copy_web)



##  配置

- 你可以自行修改最大宽度，只需要：
  1. 找到`js/content.js`文件并打开
  2. 找到`conf_list`数组，将里面元素的`max`和`min`调整为自己想要的值即可。第一个元素是标小智，第二个和第三个分别是未登录和登录状态下的标智客的。单改此处，插件界面提示不会改变，但是超过最大值时不会报错。
  3. 修改之后需要在扩展程序管理页面刷新这个插件，同时刷新网页。



## SVG转PNG

- Inernet Explorer浏览器。将free_canvas.svg文件用IE浏览器打开，另存为PNG格式的文件即可。

- Edge的IE模式。在Edge中打开free_canvas.svg文件，点击浏览器右上角用户头像左边的按钮，Edge浏览器会在IE模式下重新加载页面。加载完后，右键另存为PNG格式的文件即可。（找不到IE模式，请点击右上角三点——设置——默认浏览器，将“允许在 Internet Explorer 模式下重新加载网站”切换为允许，重启浏览器生效，再另存为PNG文件）

- 在线svg转png。



##  更新日志

- **v4.1.0 | 2022.12.5**
  1. 调整可导出的LOGO或者海报的宽度上限为原来的一倍
- **v4.0.0 | 2022.12.5**
  1. 支持标智客登陆后编辑的海报下载
  2. 修复导出1:1的LOGO的时候概率出现背景图片无法完全填充的问题
  3. 修复添加的某些图片素材导出后无法显示的问题
- **v3.3.0 | 2022.12.4**
  1. 支持登录状态下，标智客LOGO导出为正方形
  2. 新增导出的参数提示，包括是否保留背景、是否开启了智能裁剪和裁剪为正方形以及导出的尺寸
- **v3.2.1 | 2022.12.1**
  1. 修复标智客登录状态下，logo中没有任何分组，但是同时勾选保留背景和智能裁剪时，会提示有分组的问题
  2. 修复了标小智无论是否勾选保留背景都会保留背景的问题
- **v3.2.0 | 2022.11.30**
  1. 优化了自适应裁剪功能
  2. 优化了代码逻辑
- **v3.1.0 | 2022.11.29**
  
  1. 支持登陆后的标智客的LOGO的自适应裁剪
- **v3.0.0 | 2022.11.28**
  1. 支持标智客登陆后编辑的LOGO的导出
  2. 优化“去除登录框“按钮的显示
  3. 增加显示当前所在的LOGO编辑页面的类型
- **v2.0.0 | 2022.11.27**
  1. 支持对标智客的LOGO导出（未登录状态下）
- **v1.0.0 | 2022.11.26**
  1. 支持导出标小智的LOGO
  2. 支持判断当前页面是否符合导出要求
