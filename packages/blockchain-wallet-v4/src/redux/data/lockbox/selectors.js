import { path, lift, map } from 'ramda'
import { dataPath } from '../../paths'
import * as transactions from '../../../transactions'
import * as btcSelectors from '../../data/btc/selectors'
import { getLockboxBtcAccounts } from '../../kvStore/lockbox/selectors'
import { HDAccountList } from '../../../types'

const transformBtcTx = transactions.bitcoin.transformTx

export const getLockboxBtcTransactions = path([
  dataPath,
  'lockbox',
  'btc_transactions'
])

// getWalletTransactions :: state -> [Page]
export const getBtcTransactions = state => {
  // Page == Remote ([Tx])
  // Remote(wallet)
  const walletR = getLockboxBtcAccounts(state)

  // Remote(blockHeight)
  const blockHeightR = btcSelectors.getHeight(state)
  // [Remote([tx])] == [Page] == Pages
  // TODO: Descriptions from kvstore
  // const getDescription = (hash, to) =>
  //   TXNotes.selectNote(hash, Wallet.selectTxNotes(wallet)) ||
  //   getAddressLabel(to, state).getOrElse('')

  const pages = getLockboxBtcTransactions(state)

  // transformTx :: wallet -> blockHeight -> Tx
  // ProcessPage :: wallet -> blockHeight -> [Tx] -> [Tx]
  const ProcessTxs = (wallet, block, txList) =>
    map(
      transformBtcTx.bind(
        undefined,
        HDAccountList.fromJS(wallet),
        block,
        () => null,
        () => null
      ),
      txList
    )
  // ProcessRemotePage :: Page -> Page
  const ProcessPage = lift(ProcessTxs)(walletR, blockHeightR)
  return map(ProcessPage, pages)
}
