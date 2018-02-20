import { equals, isNil, prop } from 'ramda'

export const initializeForm = (prevProps, nextProps) => {
  const prevData = prevProps.data.getOrElse({})
  const prevInitialValues = prop('initialValues', prevData)
  const prevCoin = prop('coin', prevData)
  if (!isNil(prevInitialValues) && isNil(prevCoin)) {
    nextProps.formActions.initialize('sendEther', prevInitialValues)
  }
}

export const switchToBitcoinOrBchModal = nextProps => {
  const data = nextProps.data.getOrElse({})
  const coin = prop('coin', data)
  if (equals(coin, 'BTC')) {
    nextProps.modalActions.closeAllModals()
    nextProps.modalActions.showModal('SendBitcoin')
  } else if (equals(coin, 'BCH')) {
    nextProps.modalActions.closeAllModals()
    nextProps.modalActions.showModal('SendBch')
  }
}
