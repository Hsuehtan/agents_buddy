# StaffDeck 第一层级 OEM 前端改造方案：固定应用外壳版

> 文档状态：优化后的实施方案，仅更新方案，不执行产品代码改动  
> 方案版本：2026-08-23  
> 核心策略：保留 OEM 品牌配置；只改固定应用外壳和左侧 Sidebar；右侧工作区保持当前视觉与交互  
> 适用范围：`frontend-enterprise` 用户可见品牌、左侧 Sidebar、工作区外侧固定留白  
> 不适用范围：业务逻辑、API、权限、路由、页面内容区重设计、组件全局换肤

## 1. 本版方案结论

本版撤销“全站颜色、卡片、按钮、表格、聊天和 Distill 统一换肤”的方向，将第一层级 OEM 收敛为两个明确层面：

1. **OEM 品牌配置保持原方案不变**：Logo、产品名、公司名、favicon、登录图、链接等继续由构建期配置决定。
2. **视觉改动只发生在应用外壳**：参考所附图片实现左侧 Sidebar 与工作区上、下、右侧固定留白；右侧工作区内部继续使用项目当前样式。

目标效果：

- 左侧 Sidebar 和工作区外侧留白组成统一的 OEM 外壳；
- 工作区呈现为嵌入外壳中的独立浅色面板；
- 工作区内容滚动时，顶部、底部、右侧留白和面板边界始终固定；
- Sidebar 的背景、文字、激活态、悬停态、分隔线及外壳留白颜色可通过 OEM 配置切换；
- 页面内部按钮、卡片、表格、输入框、聊天气泡和 Distill 继续保持当前产品效果。

## 2. 参考图片的使用边界

参考图片只用于提取以下视觉关系：

- 深色 Sidebar 与深色外框属于同一视觉层；
- 浅色工作区位于外框内部；
- 工作区顶部、右侧、底部有持续可见的留白；
- 工作区靠近 Sidebar 一侧有清晰分隔；
- 工作区外轮廓使用圆角和轻量边界层次；
- 导航激活项可使用高对比品牌色块。

参考图片中的产品名称、菜单文案、业务模块、图标、头像、三色窗口按钮、仪表盘、插画和页面排版均不属于本项目需求，不复制、不实现。

## 3. 目标结构

### 3.1 桌面端视觉层级

```text
┌──────────────────────── OEM 固定外壳 / 视口 ────────────────────────┐
│ ┌────── 固定 Sidebar ──────┐  固定间隔  ┌── 固定工作区面板 ───────┐ │
│ │ Logo                      │            │                        │ │
│ │ 当前导航顺序与点击区域     │            │  当前页面头部           │ │
│ │ 当前员工/会话区域          │            │  ┌──────────────────┐  │ │
│ │ 当前底部操作               │            │  │ 当前内容滚动容器   │  │ │
│ │                           │            │  │                  │  │ │
│ └───────────────────────────┘            │  └──────────────────┘  │ │
│                                          └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

外壳负责：

- 视口背景；
- Sidebar 背景；
- 工作区上、下、右侧留白；
- Sidebar 与工作区之间的间隔；
- 工作区外轮廓、圆角和裁切。

工作区负责：

- 继续渲染现有页面；
- 继续使用现有页面背景、文字、按钮、卡片、表格和状态颜色；
- 继续使用现有页面级滚动容器；
- 不读取 Sidebar 配色来改变内部组件。

### 3.2 固定边框与滚动关系

必须采用“外壳不滚动，内容区内部滚动”的结构：

1. 根外壳占满 `100dvh`，并设置 `overflow: hidden`；
2. Sidebar 维持当前固定定位和独立滚动行为；
3. 工作区面板占据剩余空间，自身不参与页面滚动；
4. 工作区面板设置固定的上、下、右侧 gutter；
5. 工作区面板使用 `overflow: hidden` 保持圆角和边界固定；
6. 现有 `.content`、聊天消息列表、Distill 容器继续承担内部滚动；
7. 页面滚动前后，工作区面板的 `getBoundingClientRect()` 必须不变；
8. 禁止把 margin、边框或圆角放到会随内容滚动的页面节点上。

## 4. 与当前代码结构的对应关系

当前项目已经具备所需骨架，不需要重写路由或页面：

| 当前文件 | 当前职责 | 方案中的改动 |
| --- | --- | --- |
| `src/App.tsx` | 管理端 `SidebarProvider` 和右侧工作区容器 | 只给现有根节点与现有右侧容器增加壳层语义类 |
| `src/components/AppSidebar.tsx` | 管理端、聊天端共享 Sidebar | 读取 Sidebar 语义颜色；保持所有菜单 DOM、顺序和尺寸 |
| `src/components/ui/sidebar.tsx` | 固定 Sidebar、占位 gap、折叠逻辑 | 原则上不改；只有现有 API 无法承载壳层类时才做最小改动 |
| `src/pages/chat/ChatPage.tsx` | 聊天端根布局和主工作区 | 给现有 `<main>` 增加同一工作区面板类 |
| `src/pages/chat/ChatGalleryPage.tsx` | 聊天广场根布局和主工作区 | 给现有 `<main>` 增加同一工作区面板类 |
| `src/styles.css` | 当前全局变量、工作区和页面样式 | 不改现有工作区颜色；只接入独立 OEM 外壳样式 |
| `src/main.tsx` | 前端入口 | 在 React 渲染前同步应用 OEM 品牌和外壳变量 |
| `src/components/BrandLogo.tsx` | Sidebar 品牌展示 | 继续按原 OEM 配置替换 Logo 与产品名 |

管理端 `App.tsx` 中 Sidebar 后面的现有 `flex` 容器直接承担“工作区面板”职责，不新增页面级包装层。

聊天端 `ChatPage.tsx` 和 `ChatGalleryPage.tsx` 中现有 `<main>` 直接承担相同职责，不改变 Chat Header、消息列表、Composer 或广场页面 DOM。

## 5. 不变量与唯一布局例外

### 5.1 必须保持不变

- 路由、重定向和默认落点；
- 权限判断和管理员/普通用户的入口差异；
- Sidebar 展开宽度 `220px`、折叠宽度 `72px`；
- Sidebar 的导航分组、顺序、图标位置、文字位置和点击区域；
- Sidebar 展开/折叠入口及本地存储行为；
- 页面标题、主要按钮、搜索、筛选、列表、表格和分页之间的关系；
- 页面内部 padding、gap、卡片尺寸、表格行列、弹窗和抽屉；
- 聊天会话列表、消息顺序、输入器、附件、模型和发送入口；
- Distill 面板、标签顺序、源码区、流程图区和保存入口；
- 所有 API、Hook、状态机、事件和存储键；
- 当前右侧工作区的配色和组件视觉。

### 5.2 唯一允许的布局变化

只允许在视口与右侧工作区之间增加固定 gutter，并为工作区外轮廓增加圆角、边框和裁切。

这会让工作区的可用视口宽高减少少量像素，但不允许继续修改工作区内部布局进行“适配美化”。内部页面只按现有响应式规则自然响应。

### 5.3 禁止事项

- 不修改 `:root` 中的 `--background`、`--primary`、`--card`、`--border` 等工作区全局主题变量；
- 不对 Button、Input、Card、Badge、Table、Dialog 做 OEM 全局覆盖；
- 不修改页面文件中的颜色字面量；
- 不调整页面内容区域的 margin、padding、圆角或阴影；
- 不将 Sidebar 改成顶部导航、浮层菜单或新的信息架构；
- 不使用参考图中的三色窗口按钮、仪表盘或业务模块；
- 不改变 Sidebar 的宽度、折叠逻辑和导航点击区域；
- 不让 `body` 或根页面成为纵向滚动容器；
- 不使用会随内容滚动的伪元素模拟固定边框；
- 不引入新的 UI、动画、图标或主题依赖；
- 不修改后端代码。

## 6. OEM 品牌配置方案

### 6.1 原品牌配置保持不变

继续采用构建期配置，不引入异步请求、全局 React Provider 或新的页面加载状态。

计划新增：

- `frontend-enterprise/src/config/oem-brand.ts`
- `frontend-enterprise/public/oem/`
- `frontend-enterprise/.env.example` 中的 OEM 示例项

品牌配置结构继续使用原方案：

```ts
export const OEM_BRAND = {
  productName: 'Your Product',
  productShortName: 'Your Brand',
  companyName: 'Your Company',
  descriptor: '产品描述',
  copyright: '© 2026 Your Company',
  documentTitle: 'Your Product',
  logoUrl: '/oem/logo.svg',
  compactLogoUrl: '/oem/logo-mark.svg',
  faviconUrl: '/oem/favicon.svg',
  loginArtworkUrl: '/oem/login-artwork.webp',
  socialPreviewUrl: '/oem/social-preview.png',
  supportUrl: '',
  documentationUrl: '',
  releaseUrl: '',
} as const;
```

环境变量仍只作为可选覆盖层：

- `VITE_OEM_PRODUCT_NAME`
- `VITE_OEM_COMPANY_NAME`
- `VITE_OEM_LOGO_URL`
- `VITE_OEM_FAVICON_URL`
- `VITE_OEM_SUPPORT_URL`
- `VITE_OEM_DOCUMENTATION_URL`
- `VITE_OEM_RELEASE_URL`

### 6.2 新增独立外壳色板

不改变 `OEM_BRAND` 的字段和职责；在同一配置文件中新增独立的 `OEM_SHELL_THEME`：

```ts
export const OEM_SHELL_THEME = {
  shellBackground: '#071225',
  shellOutline: '#6f9ed6',
  sidebarBackground: '#071225',
  sidebarForeground: '#d7e0ef',
  sidebarMutedForeground: '#8fa0ba',
  sidebarHoverBackground: '#132542',
  sidebarActiveBackground: '#315fda',
  sidebarActiveForeground: '#ffffff',
  sidebarBorder: '#1c3150',
  sidebarFocusRing: '#8bb7ee',
} as const;
```

这些配置只影响 Sidebar 和外壳留白，不得映射到工作区的 `--primary`、`--background` 或其他全局主题变量。

### 6.3 CSS 变量映射

在 React 挂载前同步把配置映射为专用变量：

```css
--oem-shell-background;
--oem-shell-outline;
--oem-sidebar-background;
--oem-sidebar-foreground;
--oem-sidebar-muted-foreground;
--oem-sidebar-hover-background;
--oem-sidebar-active-background;
--oem-sidebar-active-foreground;
--oem-sidebar-border;
--oem-sidebar-focus-ring;
```

变量必须具备默认值和格式校验。配置缺失或颜色非法时回落到内置色板，不能阻止应用启动。

### 6.4 工作区颜色隔离

右侧工作区继续使用当前项目已有变量和硬编码值。OEM 外壳样式只能设置：

- 根外壳背景；
- Sidebar 专用变量；
- 工作区外轮廓；
- 固定 gutter；
- 工作区容器的圆角、裁切和非布局阴影。

工作区面板背景使用当前工作区自己的背景，不提供 OEM 配色覆盖入口，以确保“右侧工作区与当前保持一致”。

## 7. 外壳尺寸建议

外壳尺寸不作为客户品牌配置，避免错误配置破坏布局。使用代码内固定响应式 token：

| 视口 | 上 gutter | 右 gutter | 下 gutter | Sidebar/工作区间隔 | 工作区圆角 |
| --- | ---: | ---: | ---: | ---: | ---: |
| `>= 1024px` | 12px | 12px | 12px | 12px | 18px |
| `768–1023px` | 8px | 8px | 8px | 8px | 14px |
| `< 768px` | 6px | 6px | 6px | 6px | 12px |

规则：

- 同一断点内 gutter 始终固定，不随滚动变化；
- 左侧不增加额外 viewport gutter，Sidebar 继续贴合视口左侧；
- Sidebar 展开/折叠时，只允许现有宽度动画发生；
- 工作区边界随 Sidebar 宽度动画平滑移动，但不得随内容滚动；
- 使用 `100dvh`，避免移动端浏览器地址栏引起高度跳动；
- 工作区外轮廓建议为 `1px`，阴影必须向外壳方向扩散，不能改变内容尺寸。

最终数值在批次 0 截图后可做一次不超过 `4px` 的整体微调，但不能逐页面设置。

## 8. Sidebar 视觉规则

允许修改：

- Sidebar 背景、主文字、弱文字和分隔线；
- 导航 hover、active、focus、disabled 的颜色；
- Logo 和产品文字；
- 当前图标的颜色和透明度；
- 账户/员工切换区域的表面色；
- Sidebar 内部卡片的边框色，但不改变尺寸和位置。

必须保持：

- 当前图标组件和图标语义；
- 导航项高度、padding、gap 和圆角尺寸；
- 激活项所在位置与占用面积；
- 所有分组标题、分隔线、员工区和会话区的顺序；
- SidebarContent 的滚动行为；
- 折叠态只显示当前已有内容。

建议默认状态：

| 状态 | 视觉建议 |
| --- | --- |
| 默认 | 深色背景、低对比次级文字、当前图标描边 |
| Hover | 同色系浅一档背景，不位移、不缩放 |
| Active | OEM 品牌色背景与高对比文字，保留当前圆角和尺寸 |
| Focus | `2px` 可见 focus ring，不改变元素盒模型 |
| Disabled | 降低透明度，仍保留原占位 |
| Attention/Error | 继续使用项目状态色，不用品牌主色覆盖语义状态 |

## 9. 品牌配置接入范围

只允许以下展示入口读取 OEM 品牌配置：

- `BrandLogo.tsx`；
- `LoginPage.tsx`；
- `OnboardingGuide.tsx`、`QuickStartGuide.tsx`；
- `UpdateReminder.tsx`；
- favicon、document title 和社交分享元数据初始化；
- 默认员工头像的预设资源映射；
- 用户可见的支持、文档和版本链接；
- 导出文件名中的可见品牌前缀。

不改变 `App.tsx` 路由树、认证状态树或业务 Provider。

## 10. 文件修改白名单

### 10.1 外壳实施文件

- `frontend-enterprise/src/config/oem-brand.ts`：品牌配置和外壳色板；
- `frontend-enterprise/src/config/apply-oem-theme.ts`：同步校验并写入专用 CSS 变量；
- `frontend-enterprise/src/oem-shell.css`：只包含 OEM 外壳和 Sidebar 样式；
- `frontend-enterprise/src/main.tsx`：导入外壳 CSS，并在挂载前应用配置；
- `frontend-enterprise/src/App.tsx`：给现有管理端根节点和工作区容器增加语义类；
- `frontend-enterprise/src/components/AppSidebar.tsx`：把硬编码 Sidebar 颜色收敛为专用变量；
- `frontend-enterprise/src/pages/chat/ChatPage.tsx`：复用固定外壳类；
- `frontend-enterprise/src/pages/chat/ChatGalleryPage.tsx`：复用固定外壳类；
- `frontend-enterprise/src/components/BrandLogo.tsx`：读取品牌配置；
- `frontend-enterprise/public/oem/`：OEM 静态资源。

### 10.2 条件修改

- `frontend-enterprise/src/components/ui/sidebar.tsx`：只有现有 className 透传能力不足时才允许最小改动；
- `frontend-enterprise/index.html`：只有 favicon 或静态元数据无法由初始化函数处理时才修改；
- 登录页和引导页：只替换品牌文字、链接和静态资源。

### 10.3 禁止修改

- `frontend-enterprise/src/components/ui/button.tsx` 等工作区基础组件；
- `frontend-enterprise/src/lib/enterprise-ui.ts`；
- 各业务页面的视觉 class；
- `frontend-enterprise/src/pages/chat/chatPageStyles.ts`；
- `frontend-enterprise/src/pages/distillPageStyles.ts`；
- `frontend-enterprise/src/pages/chat/useChatSession.ts`；
- API、认证、类型、Hooks、路由枚举和存储 helper；
- 所有 `backend/` 文件。

如实施必须修改禁止文件，应停止当前批次并说明原因，不得扩大范围。

## 11. 分批实施方案

### 批次 0：冻结当前基线

- 分别记录管理端展开/折叠 Sidebar、聊天页和聊天广场截图；
- 在 `390 / 768 / 1024 / 1440px` 记录 Sidebar 与工作区边界；
- 记录当前 `.content`、聊天消息区和 Distill 的滚动节点；
- 记录工作区内部关键元素的 computed style；
- 不修改代码。

### 批次 1：OEM 品牌配置

- 按原方案新增 `OEM_BRAND`、静态资源目录和环境变量覆盖；
- 接入 Logo、产品名、公司名、favicon、标题、登录图和外链；
- 不改布局和页面视觉；
- 配置测试覆盖默认值、覆盖值和非法值回退。

### 批次 2：外壳色板与固定框架

- 新增 `OEM_SHELL_THEME` 和专用 CSS 变量；
- 新增 `oem-shell.css`；
- 管理端根节点使用固定外壳背景；
- 现有右侧容器成为固定工作区面板；
- 保持 `.content` 为内部滚动节点；
- 不改任何业务页面。

### 批次 3：Sidebar 配色

- 将 `AppSidebar.tsx` 中与 Sidebar 有关的硬编码颜色映射为 OEM 专用变量；
- 覆盖管理端与聊天端的 default/hover/active/focus 状态；
- 保留警告、错误、未读等语义状态颜色；
- 不调整 Sidebar 的尺寸、间距和结构。

### 批次 4：聊天端外壳复用

- `ChatPage.tsx` 和 `ChatGalleryPage.tsx` 复用与管理端完全相同的外壳；
- 现有 `<main>` 成为工作区面板；
- 保持 Chat Header、MessageList、Composer 和广场页面视觉不变；
- 验证会话侧栏和消息区分别滚动。

### 批次 5：登录、引导与品牌长尾

- 只替换 OEM 配置中的品牌文字、图片和链接；
- 检查 favicon、浏览器标题、默认头像和下载文件名；
- 不把深色应用外壳扩展到登录页，除非后续单独确认。

### 批次 6：回归与交付

- 完成自动测试、几何测试和截图对比；
- 检查不同 OEM 色板的对比度；
- 清理旧品牌可见信息；
- 输出客户替换配置说明和素材清单；
- 不在本批次追加任何视觉优化。

每个批次单独提交，前一批截图确认后再进入下一批。

## 12. 验收标准

### 12.1 固定外壳验收

- 工作区顶部、底部、右侧 gutter 在所有页面持续可见；
- Sidebar 与工作区之间的间隔持续可见；
- 页面滚动 1000px 后，工作区外轮廓位置与滚动前完全一致；
- `document.scrollingElement` 不承担应用主滚动；
- 管理端由 `.content` 滚动；
- 聊天端由消息列表滚动；
- Distill 继续使用当前内部滚动策略；
- 工作区圆角处没有内容、菜单或背景穿透；
- 弹窗、Popover、Select 和 Toast 不被工作区裁切错误遮挡。

### 12.2 工作区不变验收

- 不修改工作区全局主题变量；
- Button、Input、Card、Table、Dialog 的 computed style 与 `main` 基线一致；
- 页面内部 DOM 顺序和 className 不因 OEM 外壳改造改变；
- 页面标题、操作按钮、筛选器和列表的相对位置不变；
- 聊天气泡、Composer 和 Distill 视觉与 `main` 一致；
- 允许的几何差异只来自外壳 gutter 导致的工作区可用尺寸变化。

### 12.3 Sidebar 配置验收

- 修改 `OEM_SHELL_THEME` 后，只改变 Sidebar 和外壳留白；
- 工作区内部颜色不随色板改变；
- 展开态、折叠态、管理端和聊天端使用同一色板；
- active、hover、focus 的文字对比度满足 WCAG AA；
- 无配置、缺少配置和非法配置时均可正常启动并回退默认色板。

### 12.4 品牌验收

- 可见区域无旧 Logo、产品名和公司名；
- favicon、document title、登录页和 Sidebar 均来自 OEM 配置；
- Logo 缺失时存在可读的产品名 fallback；
- 外部链接为空时不渲染无效入口；
- 开源许可证和上游版权文件保持不变。

## 13. 自动化与浏览器验证

### 13.1 自动检查

```bash
npm --prefix frontend-enterprise test
npm --prefix frontend-enterprise run build
npm --prefix frontend-enterprise run i18n:check
npm --prefix frontend-enterprise run config:check
```

建议新增：

- OEM 配置默认值与环境变量覆盖测试；
- 非法颜色回退测试；
- `AppSidebar` 展开/折叠和两种 variant 的渲染测试；
- 工作区容器语义类测试；
- 禁止把外壳色板映射到工作区全局变量的测试。

### 13.2 浏览器几何检查

在 `390 / 768 / 1024 / 1440px` 执行：

1. 记录 Sidebar、工作区面板和内部滚动节点的矩形；
2. 滚动工作区到中部和底部；
3. 再次记录矩形；
4. 工作区面板的 `top/right/bottom` 误差必须为 `0px`；
5. Sidebar 外边界误差必须为 `0px`；
6. 只有内部滚动节点的 `scrollTop` 发生变化；
7. 页面不得出现 viewport 级横向滚动条。

覆盖页面：

- 管理端：数字员工、员工档案、表格页、设置页；
- 聊天端：空会话、有消息会话、附件与长回复；
- 聊天广场；
- Distill 普通模式与全屏模式；
- Sidebar 展开态和折叠态；
- 管理员和普通用户。

### 13.3 截图检查

每个目标宽度输出三组截图：

- `main` 原始界面；
- 默认 OEM 外壳；
- 客户色板 OEM 外壳。

截图对比时分别检查：

- 外壳区域应产生预期差异；
- 工作区内部应与 `main` 保持一致；
- 滚动前后固定 gutter 不发生位移；
- 深色与浅色 OEM 色板均无图标、文字或 Logo 对比度问题。

## 14. 用户需要提供的材料

### 14.1 必需文字

- 产品中文名、英文名和简称；
- 公司中文名、英文名；
- 一句话产品描述；
- 登录页说明；
- 版权文字；
- 支持链接、文档链接、版本发布链接；
- 导出文件名前缀。

### 14.2 必需图片

- 横版 Logo：SVG 优先，透明背景；
- 紧凑 Logo Mark：SVG，适用于 Sidebar 折叠态；
- favicon/App Icon：SVG 和 512×512 PNG；
- 登录页图片：建议 1600×1200，WebP/PNG；
- 默认员工头像和岗位头像：建议 512×512；
- 引导页图片：按当前引导卡片比例提供；
- 社交分享图：1200×630 PNG。

### 14.3 外壳色板

- 外壳/留白背景色；
- 外壳轮廓色；
- Sidebar 背景色；
- Sidebar 主文字色和弱文字色；
- 导航 hover 背景色；
- 导航 active 背景色和文字色；
- Sidebar 分隔线色；
- 键盘 focus ring 色；
- 深色和浅色 Logo 的使用规则。

如果暂未提供完整色板，可先提供品牌主色和 Sidebar 深浅偏好，由默认算法生成候选色板，确认后再固化到配置。

### 14.4 授权信息

- Logo、插画、头像和字体的版权或再分发授权；
- 是否允许将素材随开源 OEM 版本一并发布；
- 不允许公开的客户专属素材清单。

## 15. 开源与第二层级边界

- 保留仓库许可证、上游版权声明和开源义务；
- UI 不展示上游品牌不等于删除许可证文件；
- 新增素材必须确认可随开源代码分发；
- 第一层级只处理用户可见品牌与外壳视觉；
- `staffdeck_*`、`ultrarag_*` 等内部存储键、组件名、包名和协议字段留到第二层级；
- 第二层级必须设计兼容迁移，不执行全仓库机械替换。

## 16. 实施完成定义

同时满足以下条件才算第一层级完成：

1. OEM 品牌配置可以独立替换 Logo、名称、图片和外链；
2. OEM 外壳色板可以独立替换 Sidebar 和固定留白颜色；
3. 工作区上、下、右侧 gutter 在滚动时固定存在；
4. 管理端、聊天端和聊天广场使用同一外壳；
5. 右侧工作区内部视觉与 `main` 保持一致；
6. 页面流程、按钮位置关系、Sidebar 信息架构和业务逻辑未改变；
7. 自动测试、构建、几何检查和截图检查全部通过；
8. 所有客户素材具备明确授权，开源许可证保持完整。

本方案的视觉差异集中在“应用外壳和品牌入口”，不再通过全站换色制造差异。这样既能形成清晰的 OEM 产品边界，也能最大限度降低对现有工作区视觉、用户操作记忆和业务回归的影响。
