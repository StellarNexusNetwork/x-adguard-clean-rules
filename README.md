# x-adguard-clean-rules

适用于 x.com 的 AdGuard 自定义过滤规则，以及配套的零宽字符清理脚本。

## 使用方法

### 添加 AdGuard 规则

将下面这个链接添加到 AdGuard 的“自定义过滤器”中：

```URL
https://raw.githubusercontent.com/StellarNexusNetwork/x-adguard-clean-rules/refs/heads/main/rules.txt
```

一般路径是：

设置 → 过滤器 → 自定义 → 添加自定义过滤器

添加后保存即可。

### 使用零宽字符清理脚本

先安装支持 UserScript 的扩展，例如 Tampermonkey，然后导入下面这个脚本：

[点击一键安装](https://raw.githubusercontent.com/StellarNexusNetwork/x-adguard-clean-rules/refs/heads/main/x-zero-width-clean.user.js)

导入后打开 x.com 或 twitter.com 即可生效。

## 文件说明

- `rules.txt`：AdGuard 过滤规则
- `x-zero-width-clean.user.js`：零宽字符清理脚本

## 反馈

如果发现漏网内容、误杀，或者新的规避写法，可以提交 Issue。
懒猫随缘更新规则，~~谁给个gpt plus催下也不是不行~~
