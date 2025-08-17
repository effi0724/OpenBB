# OpenBB 自定义 AKShare 功能扩展

这是一个自定义的 OpenBB 扩展，提供了基于 AKShare 的中国股市龙虎榜数据功能。

## 功能特性

- 获取每日龙虎榜数据
- 直接集成 AKShare 库
- 提供标准的 OpenBB API 接口

## 安装

这个扩展会自动被 OpenBB 平台识别和加载。

## 使用方法

通过 OpenBB API 访问：

- `/api/v1/longhu_bang/daily` - 获取每日龙虎榜数据

## 依赖

- openbb-core
- akshare
- pandas
