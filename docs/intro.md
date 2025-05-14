---
sidebar_position: 1
---

# 概要

Milease 兼容 `Unity 6000`, `Unity 2022`, `Unity 2021`, `Unity 2020`。

`Unity 2019` 以及更早的版本**不受支持**。

该文章将简要介绍兼容性、导入步骤 以及 基本工作原理。

## 导入步骤

在你的 Unity 项目的 `Packages/manifest.json` 中加入以下内容：

```json title="manifest.json"
"com.morizero.milease": "https://github.com/MorizeroDev/Milease.git",
"party.para.util.colors": "https://github.com/ParaParty/ParaPartyUtil.git?path=Colors",
```

如果你的项目的 Unity 版本 ≤ Unity 2021，或未使用 `.NET Standard 2.1`，则需要**额外**导入 `PolyFill` 模块：

```json title="manifest.json"
"party.para.util.unitypolyfill": "https://github.com/ParaParty/ParaPartyUtil.git?path=UnityPolyfill",
```

## 配置 Milease

在 Unity 的菜单栏中，点击“Milease -> Configuration...”，在此处选择 动画计算实现方案：

![img](img\configuration.png)

我们推荐“源码生成”方案，因为它的兼容性最好。

:::warning

”表达式树(Expression)“ 方案由于依赖 JIT 动态编译，无法在 iOS 等不支持 JIT 的平台上运行

:::

## 基本原理

Milease 支持两种动画计算解决方案：

| 脚本后端\实现方案 | 源码生成(Code Generation) | 表达式树(Expression) |
| ----------------- | ------------------------- | -------------------- |
| Mono              | ✅ 完全支持                | ✅ 支持               |
| IL2CPP            | ✅ 完全支持                | 🚫 不支持             |

首先，对于源码生成方案，Milease 会对可进行动画操作的类型生成计算代码，并对包含这些类型的常见成员生成访问代码，这些生成的代码将放置在 `Milease.CodeGen` 程序集中。你可以通过更改该程序集的 `AccessorGenerationList` 和 `GenerationDisableList.cs` 指定要生成的成员访问代码 和 禁用生成的类型的计算代码。若操作的成员或类型未事先生成相关代码，则会退回使用反射完成相关的操作；对于表达式树方案，Milease 会在首次遇到相关计算时，构造计算表达式，并进行动态编译。

接着，当你调用 Milease 动画函数时，它将生成一个动画机实例，并根据你提供的 `MemberExpression` 解析受操作的成员，构建动画控制实例。然后，在你首次调用播放函数时，动画管理器的全局单例会被生成，并完成一系列的初始化的操作：包括但限于，注册场景卸载事件，自动移除仅在当前场景有效的动画机。

最后，动画管理器会在每一帧通知所有活跃动画机进行更新。其中，动画管理器分为“一般动画管理器”和“状态动画管理器”。状态动画管理器的 `Update` 顺序为“-2”，即在没有特别设定的情况下，早于其他的所有脚本的 `Update` 。

## 注意事项

:::warning

* 对于源码生成方案，若操作的成员并未包含在 `AccessorGenerationList` 中，则会回退到使用反射完成相关操作，这将大幅度降低在一些情景的性能，如果该成员受到高频操作，建议将其拆分至 `Common` 程序集，然后将其添加至  `AccessorGenerationList`，并重新生成代码（点击 Milease 菜单中的“Generate source code”）。
* 对于表达式树方案，执行动态编译的操作可能比较耗时，建议提前完成。你可以点击 Milease 菜单中的 “**Milease -> Generate Milease warming up script**” 生成预热代码，在加载阶段一次性完成常见计算的动态编译，使得局内体验更加流畅。
* 在动画机的构造阶段，是存在反射操作的，并可能使 `GC.Alloc` 成为此时的一个性能瓶颈 —— 因此，如果这个动画几乎不会改变，且非常庞大，则建议在加载阶段完成构造，然后不断复用；若是简单的构造，则以上开销是可以忍受的。
* 虽然动画计算本身的开销很低，对于 `Transform` 或相关组件的更新可能会成为性能的瓶颈，需要额外的优化手段。
* 对于源码生成方案，你可能会发现一个情况，你的代码的程序集 需要 引用 Milease 程序集访问动画操作，而 Milease 程序集 需要 引用 `Milease.CodeGen` 访问生成的源码，而如果你的自定义类型/成员也在同一程序集中，这意味着此处会产生循环依赖，这是不受 Unity 支持的。对于这种情况，建议拆分到 `Common` 程序集，编写一些代理类。

:::
