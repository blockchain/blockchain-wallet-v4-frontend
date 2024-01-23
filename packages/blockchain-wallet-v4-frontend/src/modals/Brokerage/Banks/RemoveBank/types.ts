import { BSPaymentTypes } from '@core/types'

export type RemoveBankModalProps = {
  accountId: string
  accountNumber: string
  bankName: string
  bankType: BSPaymentTypes.BANK_ACCOUNT | BSPaymentTypes.BANK_TRANSFER
}
