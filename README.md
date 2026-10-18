#  自由画布 - 一键免费下载高清无水印LOGO v4.3.0

<img src="https://raw.githubusercontent.com/quarkape/free-canvas/main/img/free-canvas-t.png" alt="image" style="height:100px" />

&nbsp;

## 适用网站

[![](https://img.shields.io/static/v1?label=标小智&message=https://www.logosc.cn/&color=666&labelColor=0081ff)](https://www.logosc.cn/)&emsp;[![](https://img.shields.io/static/v1?label=标智客&message=https://www.logomaker.com.cn/&color=666&labelColor=00deb4)](https://www.logomaker.com.cn/)

&nbsp;&nbsp;

## 安装

最新下载：<https://github.com/quarkape/free-canvas/releases/latest>（点页面上的 Source code.zip 即可，见下方第 2 条注意）

1. 下载项目并解压
2. GitHub 的压缩包解压后会多出一层 `free-canvas-版本号` 目录，`manifest.json` 在里面那一层，加载扩展时要选那一层
3. 在地址栏输入`chrome://extensions/`（Edge浏览器是`edge://extensions/`）回车，进入扩展程序管理页面
4. 打开开发者模式，并在页面找到加载已解压的扩展程序，选择上一步那个包含 `manifest.json` 的目录

&nbsp;

## 使用

- logo导出

  1. 进入网站的LOGO编辑页面（标智客可以直接用生成页 `https://www.logomaker.com.cn/guide`，点开一个LOGO预览即可，不需要登录）
  2. 点击插件图标，按需填写导出宽度（留空用默认值），选择是否保留背景、是否裁剪
  3. 选择格式：SVG 矢量（默认，印刷可用）或 PNG 位图（可直接使用，免转换）
  4. 点击处理并下载
- 标智客海报导出步骤类似，建议勾上"保留LOGO背景"，宽度不要填太大（海报里的图片素材放大后会糊）

&nbsp;



## 界面

<img src="https://raw.githubusercontent.com/quarkape/free-canvas/main/img/ui.png" alt="image" />



&nbsp;

## 功能支持

|             |      导出logo      | 去除/保留logo背景  |        自适应裁剪        |         导出海报         |         1:1裁剪          |
| :---------: | :----------------: | :----------------: | :----------------------: | :----------------------: | :----------------------: |
| 标小智      | :heavy_check_mark: | :heavy_check_mark: |    :heavy_check_mark:    | :heavy_multiplication_x: |    :heavy_check_mark:    |
| 标智客·生成页 | :heavy_check_mark: | :heavy_check_mark: |    :heavy_check_mark:    | :heavy_multiplication_x: |    :heavy_check_mark:    |
| 标智客·高级编辑 | :heavy_check_mark: | :heavy_check_mark: |    :heavy_check_mark:    |    :heavy_check_mark:    |    :heavy_check_mark:    |

另外支持直接导出 PNG 位图（在弹窗里勾选格式），不需要再用 IE 或在线工具转换。生成页会自动移除登录弹窗，不登录也能编辑和下载；想登录请回到网站首页。

:information_source: *未来将支持更多功能，包括圆形裁剪、圆形纯色背景、支持更多可用网站等*

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

1. 标智客的生成页（`https://www.logomaker.com.cn/guide`）不需要登录就能编辑和下载；插件会自动移除那个登录遮罩。要登录请回首页，或把 `js/content.js` 里的 `GUIDE_UNMASK` 改成 `false` 恢复原样。进入高级编辑页仍然需要登录（保存环节会拦），但一般没必要进去，生成页就能下载
2. 裁剪功能**不再要求右下角缩放 100%，也不再需要手动取消编组**，按图形实际范围计算
3. 勾选导出1:1比例的logo的同时勾选保留背景时，为了完全填充，可能会放大背景图片
4. 插件安装完成后，请刷新LOGO编辑页面
5. 编辑LOGO的时候，不要超过给定的框
6. 点过编辑面板的"动画"之后，图层可能停在动画第一帧（透明状态），这时导出会缺文字或图标；插件会在结果里提示有几个透明图层，把动画播完或选回无动画再导出即可
7. PNG 位图是浏览器现场画出来的，单边不超过 16384 像素、总面积不超过 1 亿像素，尺寸越大耗时越长（10000 宽大约十几秒），期间不要切走标签页；转不了位图时（比如素材跨域）请改用 SVG 格式

&nbsp;

## 演示视频

 [![](https://img.shields.io/badge/bilibili-演示视频(v1.0.0版本的)-red.svg?logo=Bilibili&color=00A1D6)](https://www.bilibili.com/video/BV1t84y1r71B?share_source=copy_web)

&nbsp;

## SVG转PNG

- 从 v4.3.0 起，直接在插件弹窗里勾选 **PNG 位图** 就能导出成品，不用再做下面的转换（注意单边 16384 像素以内）。

- Inernet Explorer浏览器。将free_canvas.svg文件用IE浏览器打开，另存为PNG格式的文件即可。

- Edge的IE模式。在Edge中打开free_canvas.svg文件，点击浏览器右上角用户头像左边的按钮，Edge浏览器会在IE模式下重新加载页面。加载完后，右键另存为PNG格式的文件即可。（找不到IE模式，请点击右上角三点——设置——默认浏览器，将“允许在 Internet Explorer 模式下重新加载网站”切换为允许，重启浏览器生效，再另存为PNG文件）

- 在线svg转png。



&nbsp;

## 支持

- 每次网站更新时，都需要同步更新代码

- 后续将提供更多的功能支持，增加更多网站

- **你的支持是我不断努力的动力~**

  | <img src="https://raw.githubusercontent.com/quarkape/free-canvas/main/img/wechat.jpg" alt="wechat" /> | <img src="https://raw.githubusercontent.com/quarkape/free-canvas/main/img/alipay.jpg" alt="alipay" /> |
  | :----------------------------------------------------------: | :----------------------------------------------------------: |
  |                            支付宝                            |                             微信                             |

  &nbsp;

  

##  更新日志

- **v4.3.0 | 2026.10.18**
  1. 支持标智客生成页（`/guide`）直接导出：无需登录、无需进入高级编辑，点开 LOGO 预览即可下载矢量 SVG
  2. 生成页自动移除登录遮罩（如需登录，请回到网站首页即可登录）
  3. 三个页面的导出逻辑统一重写：尺寸按画布自身 viewBox 计算，裁剪按图形实际包围盒计算，不再要求右下角缩放 100%，也不再需要手动取消编组；导出过程只读页面，不再把图层搬走导致编辑页空白
  4. 修复高级编辑页"填了宽度没用"的问题，以及多图层合并时丢失滤镜、渐变定义的问题
  5. 导出尺寸统一写成普通小数，避免 viewBox 里出现科学计数法（SVG 1.1 不认这种写法）
  6. 新增 PNG 位图导出（用浏览器离屏 canvas 转换；单边 16384、总面积 1 亿像素以内，超出会直接告诉你当前比例下最大可用宽度）
  7. 裁剪为正方形支持四周留白比例与 LOGO 位置（靠左 / 居中 / 靠右）
  8. 参数填错、页面改版、图层停在透明中间帧等情况都会返回具体原因，不再只显示 `undefined`
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
