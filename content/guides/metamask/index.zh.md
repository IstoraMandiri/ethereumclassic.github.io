---
title: 使用 MetaMask 与 ETC
date: 2021-03-02
author: Donald McIntyre, Etherplan
seo: 一个分步指南，涵盖如何使用MetaMask 与 Etherum经典发送ETC 并与分散的应用程序交互。
info: 这篇文章是[由 Etherplan](https://etherplan.com/2021/03/02/how to connect-metmask-etherum-classic/15512/)。 欲了解更多Etherum Classic Tutories, they and cryptocurency concepts, 请签出 [etherplan.com](https://therplan.com)。
contributors:
  - DonaldMcIntyre
---

[MetaMask](https://metamask.io) 可以用作一个钱包来管理您的 ETC 和 Token，以及与支持它的应用程序交互。 这个帖子解释了如何开始使用 MetaMask 与 Ethereum Classic (ETC) 网络。

你也可以考虑 [Nifty Wallet](https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid?ucbcb=1), 一个超级蒙板的叉, 它支持用箱子的ETC.

## 1. 登录到元蒙版

第一步是登录以解锁您的MetaMask。

![步骤1](./01.png)

## 2. 查看初始屏幕

您将看到您正常的初始屏幕。 在这种情况下，默认网络是 Ethereum (ETH)，您的账户将会像往常一样显示。 当您使用其他网络时，当您解锁您的MetaMask时，如果它们是最后使用的网络时，它们会显示为默认。

在我的情况下，它会显示以太坊为初始网络，在我的ETH账户 `0x48c1...EfF3` 有零余额。

![步骤2](./02.png)

## 3. 打开网络下拉菜单

下一步是打开网络下拉菜单。 您可以通过点击显示默认网络的栏来做到这一点。

从上文可以看出，网络的默认清单是以太坊主主网及其最受欢迎的测试网。

“本地主机8545”将连接到以太坊节点，如果您在机器中运行一个。

“自定义辐射防委会”是添加自定义网络的选项，在这种情况下是ETC。

“RPC”是指“远程程序电话”，这是指协议机器用来在远程机器中呼叫其他程序的程序。

![步骤3](./03.png)

## 4. 选择自定义 RPC

因此，下一步是单击“自定义保养”。

![步骤4](./04.png)

## 5. 查看新的网络表单

选择“自定义 RPC 后，您将看到添加网络的表格。 它在顶部有一个安全消息，五个选项有空字段进入您想要使用的新网络：

- 网络名称：您想要添加的网络名称。
- 新 RPC URL：您想要添加的网络 RPC 的 URL。
- 链： 发送和直接交易到您想要添加的网络的ID。
- 货币符号(可选)：您想要添加的网络货币符号。 例如，“ETH”是以太空文标示的符号，而“ETC”是以太空文标示的符号。
- Block Explorer URL (可选)：MetaMask 每个网络都有与 blockchain 浏览器的链接来检查帐户历史记录。 新交易已发送和余额，所以在这里您将为您想要添加的网络添加一个区块浏览器。

![步骤5](./05.png)

## 6. 输入以太久经典网络信息

下一步是添加以太空类的具体信息。 下面是我使用的网络数据：

- 网络名称： `Ethereum 经典`
- 新 RPC URL： `https://www.ethercluster.com/etc`
- 链号 ID: `61`
- 货币符号(可选)： `ETC`
- 区块资源管理器URL (可选)： `https://blockscout.com/etc/mainnet/`

在“RPC URL”中，我使用了 [ETC Cooper](https://etccooperative.org/)为此目的提供的URL， 这是从他们生成的产品 [以太集群](https://ethercluster.com/)

_[编辑注释] 以太集群现在由 [RIVET](https://rivet.cloud/) 运行。 您可以在 [网络](/network/endpoints) 部分中找到更多RPC 端点。_

“链”必须是“61”，因为这是Ethereum Classic 网络通过钱包和节点发送ETC 交易到操作区块链的具体ID。

虽然“符号”和“区块浏览器URL”是可选的， 我建议使用“ETC”作为标志，因为这是广为人知的网络市场象征。 和BlockScout作为区块链浏览器，因为这是我通常使用的 (但你可以添加你喜欢的!)。

点击“保存”将ETC添加到MetaMask。

![步骤6](./06.png)

## 7. 在网络下拉菜单中查看以太久经典

ETC添加后，您将在网络下拉菜单中看到它被添加到网络列表中。

![步骤7](./07.png)

## 8. 您可以在ETC上查看您相同的账户

如果您转到您的帐户，您会注意到它与您的 ETH 帐户相同。 在我的情况下，它是相同的 `0x48c1...EfF3` 账户。

这是因为ETH和ETC都使用相同的账户格式，因此Etherum上的账户也可以用于Ethereum Classic。

事实上，你可能记得我的ETH账户余额为零。 但现在可以在同一账户中看到1辆ETC车的余额，但是在Ethereum Classic上。 这是因为我为此演示在埃瑟姆经典网络中向该帐户发送了1个ETC。

还注意到ETC网络现在是网络栏中显示的网络网络， “ETC”符号现在用来显示平衡。

![步骤8](./08.png)

## 9. 您可以使用相同的帐户返回以太坊。

因此，由于两个网络使用相同的账户格式，您可以移动到以太坊主网，您将能够再次看到相同号码的ETH账户。

![步骤9](./09.png)

## 10. 您可以使用相同的帐户返回以太基姆经典。

要使用ETC网络，只需在网络下拉菜单中再次选择Etherum经典，您将在下拉菜单中再次看到您的 ETC 余额。

![步骤10](./10.png)

//

我祝您成功地投资和使用ETC！

---

** 代码是法律**
