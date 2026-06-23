# MacCinny

这是一个只保留 macOS 桌面端的 Matrix 客户端，技术栈为 `React + Vite + Tauri 2 + Rust`。

## 已完成的精简

- 删除了 Windows 安装包与内置更新链路
- 删除了 PWA、Service Worker、Netlify、Pages、Docker 等网页发布相关内容
- 保留了 Tauri 桌面 UI、媒体缓存、通知、文件保存等桌面能力
- 增加了 GitHub Actions 的 macOS Intel / Apple Silicon 自动打包流程

## 本地开发

```bash
npm install
npm run desktop:dev
```

## 本地打包

```bash
npm install
npm run desktop:build
```

会生成 macOS 的 `.app` 和 `.dmg`。

## GitHub 自动打包

把代码推到 `iszkq/maccinny` 后，打一个版本标签并推送：

```bash
git tag v1.4.7
git push origin main --tags
```

GitHub Actions 会自动构建：

- `x86_64-apple-darwin`
- `aarch64-apple-darwin`

打标签时会把产物上传到 GitHub Release；普通分支和 PR 则会作为 Actions Artifact 保存。

## 说明

- `config.json` 仍然保留，因为桌面端运行时仍然需要读取它。
- 为了让 GitHub 在不额外配置签名私钥的情况下也能直接打包，应用内自动更新签名链路已经移除。
