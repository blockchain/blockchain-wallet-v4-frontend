import { CardAcquirer, SwapOrderDirectionType } from '@core/types'
import { SwapAccountType, SwapBaseCounterTypes } from 'data/components/swap/types'
import { PaymentApiKeys } from 'data/types'

const getDirection = (
  from: SwapAccountType
): Exclude<SwapOrderDirectionType, 'TO_USERKEY' | 'ON_CHAIN'> => {
  switch (true) {
    case from.type === SwapBaseCounterTypes.ACCOUNT:
      return 'FROM_USERKEY'
    default:
      return 'INTERNAL'
  }
}

const getPaymentApiKeys = (cardAcquirers: CardAcquirer[]) => {
  const paymentPartners = {} as PaymentApiKeys

  cardAcquirers.forEach((cardAcquirer) => {
    cardAcquirer.cardAcquirerAccountCodes.forEach((cardAcquirerAccountCode) => {
      paymentPartners[cardAcquirerAccountCode] = cardAcquirer.apiKey
    })
  })

  return paymentPartners
}

export { getDirection, getPaymentApiKeys }
