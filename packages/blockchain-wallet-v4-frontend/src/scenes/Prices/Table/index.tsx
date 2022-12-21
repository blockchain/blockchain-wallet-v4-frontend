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
    isCoinViewV2Enabled,
    modalActions,
    routerActions,
    swapActions,
    walletCurrency
  }: TableColumnsType) =>
  () =>
    [
      getNameColumn(modalActions, routerActions, isCoinViewV2Enabled),
      getPriceColumn(walletCurrency),
      getPriceChangeColumn(),
      getMarketCapColumn(walletCurrency),
      getBalanceColumn(),
      getActionsColumn(analyticsActions, modalActions, buySellActions, swapActions, formActions)
    ]
