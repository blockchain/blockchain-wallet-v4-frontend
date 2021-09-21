import { EthPaymentType, RemoteDataType } from '@core/types'

export type TransferEthState = {
  payment: RemoteDataType<string, EthPaymentType['value']>
}
