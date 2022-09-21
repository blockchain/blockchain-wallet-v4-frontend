import { CoinType } from '@core/types'
import { ModalOriginType } from 'data/types'

type OpenTransactionReportModalCallback = (props: {
  coin: CoinType
  origin: ModalOriginType
}) => void

type OpenTransactionReportModalHook = () => OpenTransactionReportModalCallback

export type { OpenTransactionReportModalCallback, OpenTransactionReportModalHook }
