import { useIntl } from 'react-intl'

const useTitle = (type: 'Trade' | 'Withdraw') => {
  const { formatMessage } = useIntl()
  switch (type) {
    case 'Trade':
      return formatMessage({ defaultMessage: 'Available to trade', id: 'copy.available_to_trade' })
    case 'Withdraw':
    default:
      return formatMessage({
        defaultMessage: 'Available to withdraw',
        id: 'copy.available_to_withdraw'
      })
  }
}

export default useTitle
