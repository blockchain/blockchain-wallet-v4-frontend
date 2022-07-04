import { TableColumnsType } from '..'
import { getActionsColumn } from './actions.column'
import { getBalanceColumn } from './balance.column'
import { getMarketCapColumn } from './marketCap.column'
import { getNameColumn } from './name.column'
import { getPriceColumn } from './price.column'
import { getPriceChangeColumn } from './priceChange.column'

export const getTableColumns =
  ({
    analyticsActions,
    buySellActions,
    formActions,
    interestActions,
    modalActions,
    swapActions,
    walletCurrency
  }: TableColumnsType) =>
  () =>
    [
      getNameColumn(modalActions),
      getPriceColumn(walletCurrency),
      getPriceChangeColumn(),
      getMarketCapColumn(walletCurrency),
      getBalanceColumn(),
      getActionsColumn(
        analyticsActions,
        interestActions,
        modalActions,
        buySellActions,
        swapActions,
        formActions
      )
    ]
