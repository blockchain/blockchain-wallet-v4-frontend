
# Components guildelines

## Introduction

This `components` folder contains shared components, usable accross scenes, modals and layouts that are behaving in the same way.

There are quite generic, in the way that different components could potentially use them with specific implementations.

Few examples:

1. `CountdownTimer` is used in Exchange, Coinify and Sfox journeys, but behave in the same way for those 3.
2. `Alerts` is used in the both Public and Wallet layouts
3. `TransactionListItem` is used in scenes/Transactions/Btc , scenes/Transactions/Bch and scenes/Transactions/Eth to uniformize the way we display our list of transactions accross our different coins
4. All our Redux-Form compatible custom components (`Textbox`, `NumberBox`, `SelectBox` ...)
5 `ExchangeTimeline` is used in scenes/Exchange/ThirdStep and ExchangeDetails modal
5. Etc...

## What can I add here ?

Any component that
* behaves the same way
* has a well defined API (with propTypes, defaultProps defined)
  * propTypes helps knowing which type of data is required (String, Number, bool ...)
  * defaultProps allows assigning default props to optional props
  * :warning: Don't forget to define propTypes and defaultProps, it gives precious hints about how to reuse properly those shared components.
* looks similar, but needs to be reused in different pages or modals.

## What can't I add here ?

Any component that
* is too specific
* has different behaviors
* you think is only going to be used once in the project
  * In that case, your custom component should live inside your page/modal
