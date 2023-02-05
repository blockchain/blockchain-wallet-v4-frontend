import { useIntl } from 'react-intl'

const useTitle = (type: 'Trade' | 'Withdraw') => {
  const { formatMessage } = useIntl()
  switch (type) {
    case 'Trade':
      return formatMessage({
        defaultMessage: 'Available to trade (est.)',
        id: 'copy.available_to_trade_est'
      })
    case 'Withdraw':
    default:
      return formatMessage({
        defaultMessage: 'Available to withdraw or send (est.)',
        id: 'copy.available_to_withdraw_or_send_est'
      })
  }
}

export default useTitle
