import { getActionsColumn } from './actions.column'
import { getLinkColumn } from './link.column'
import { getNameColumn } from './name.column'
import { getWalletColumn } from './wallet.column'

export const getTableColumns = ({ modalActions, walletConnectActions }) => [
  getNameColumn(),
  getLinkColumn(),
  getWalletColumn(),
  getActionsColumn(modalActions, walletConnectActions)
]
