#  Free Canvas  v4.2.0

<img src="https://raw.githubusercontent.com/quarkape/free-canvas/main/img/free-canvas-t.png" alt="image" style="height:100px" />

### **快速**、**免费**下载无水印、大尺寸的LOGO、海报等！

### :warning: 后续版本将在谷歌商店更新（自由画布 - 免费下载高清无水印LOGO）



## 适用网站

[![](https://img.shields.io/static/v1?label=标小智&message=https://www.logosc.cn/&color=666&labelColor=0081ff)](https://www.logosc.cn/)&emsp;[![](https://img.shields.io/static/v1?label=标智客&message=https://www.logomaker.com.cn/&color=666&labelColor=00deb4)](https://www.logomaker.com.cn/)

&nbsp;&nbsp;

## 安装

1. 下载项目
2. 在地址栏输入`chrome://extensions/`（Edge浏览器是`edge://extensions/`）回车，进入扩展程序管理页面
3. 打开开发者模式，并在页面找到加载已解压的扩展程序，选择解压后的本项目

&nbsp;

## 使用

- logo导出

  1. 进入网站的LOGO编辑页面
  3. 点击插件，根据需求填写LOGO宽度，根据需求选择是否需要保留背景或者开启智能裁剪
  4. 点击处理并下载
- 标智客海报导出步骤类似



## 界面

<img src="https://raw.githubusercontent.com/quarkape/free-canvas/main/img/ui.png" alt="image" style="height:100px" />



## 功能支持

|        |      导出logo      | 去除/保留logo背景  |        自适应裁剪        |         导出海报         | 1:1裁剪 |
| :----: | :----------------: | :----------------: | :----------------------: | :----------------------: | ------- |
| 标小智 | :heavy_check_mark: | :heavy_check_mark: | :heavy_multiplication_x: | :heavy_multiplication_x: |         |
| 标智客 | :heavy_check_mark: | :heavy_check_mark: |    :heavy_check_mark:    |    :heavy_check_mark:    |         |

:information_source: *未来将支持更多功能，包括圆形裁剪、自定义正方形裁剪留白边、圆形纯色背景、支持更多可用网站等*

&nbsp;

## 常见问题

1. IE转PNG的时候，如果提示“意外的调用了属性或方法”，需要把LOGO或者海报的宽度调低一些，或者使用在线转换
2. PS转换SVG文件，有可能转换后的PNG文件有些素材的背景会变成黑色，可以使用IE转换或者在线转换
3. 如果点击立即处理后提示`undefined`，刷新LOGO编辑页面
4. `windows defender`提示插件压缩包有风险，解压后一般不会再提示
5. 智能裁剪得到的logo可能周边有些细微的空边，这常见于添加了文字的logo并且文字在logo的边界，暂无法解决
6. 导出LOGO后页面空白，有可能是因为LOGO主体是白色的，需要保留背景才能看到LOGO主体
7. 有的海报设置较大宽度导出后会模糊，可能因为海报里面的图片非矢量，放大会模糊

&nbsp;

## 注意事项

1. 标智客需要登陆后使用
2. 裁剪功能需要确保：
   - **页面右下角的编辑比例必须是100%**
   - **logo中没有处于编组的素材**。已知会有编组状态的素材是：字体——书法字、标题、列表内容等（通过“添加文字”按钮添加的文字没有编组状态）。当添加了这些编组状态的素材时，你需要单击这些素材，然后点击左上角出现的取消编组按钮（重复此过程直到所有素材的编组都取消）
3. 勾选导出1:1比例的logo的同时勾选保留背景时，为了完全填充，可能会放大背景图片
4. 插件安装完成后，请刷新LOGO编辑页面
5. 编辑LOGO的时候，不要超过给定的框

&nbsp;

## 演示视频

 [![](https://img.shields.io/badge/bilibili-演示视频(v1.0.0版本的)-red.svg?logo=Bilibili&color=00A1D6)](https://www.bilibili.com/video/BV1t84y1r71B?share_source=copy_web)

&nbsp;

## SVG转PNG

- Inernet Explorer浏览器。将free_canvas.svg文件用IE浏览器打开，另存为PNG格式的文件即可。

- Edge的IE模式。在Edge中打开free_canvas.svg文件，点击浏览器右上角用户头像左边的按钮，Edge浏览器会在IE模式下重新加载页面。加载完后，右键另存为PNG格式的文件即可。（找不到IE模式，请点击右上角三点——设置——默认浏览器，将“允许在 Internet Explorer 模式下重新加载网站”切换为允许，重启浏览器生效，再另存为PNG文件）

- 在线svg转png。



## 捐赠

- 网站代码更改时，插件也需要定期更新

- 后续将提供更多的功能支持，增加更多网站，你也可以将好的网站分享出来

  | <img src="https://raw.githubusercontent.com/quarkape/free-canvas/main/img/wechat.jpg" alt="image" style="height:100px" /> | <img src="https://raw.githubusercontent.com/quarkape/free-canvas/main/img/alipay.jpg" alt="image" style="height:100px" /> |
  | :----------------------------------------------------------: | :----------------------------------------------------------: |
  |                            支付宝                            |                             微信                             |

  &nbsp;

##  更新日志

- **v4.2.0 | 2024.1.16**
  1. 修复了标智客导出logo的各种问题
  2. 移除了标智客未登陆时的各种可选项，因为标智客在未登陆的情况下功能受限
  3. **下个版本将在应用商店上新，可能会开启收费模式**
- **v4.1.1 | 2022.12.7**
  1. 修复了标小智不勾选保留背景之后在IE模式下加载背景变为黑色的问题
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
