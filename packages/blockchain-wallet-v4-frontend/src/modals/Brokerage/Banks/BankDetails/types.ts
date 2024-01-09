import { BSPaymentTypes } from '@core/types'

export type BankDetailsModalProps = {
  accountId: string
  accountNumber: string
  accountType: string
  bankName: string
  bankType: BSPaymentTypes.BANK_ACCOUNT | BSPaymentTypes.BANK_TRANSFER
}
