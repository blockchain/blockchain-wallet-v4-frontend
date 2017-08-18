import React from 'react'
import PropTypes from 'prop-types'

import { Button } from 'blockchain-info-components'
import CoinDisplay from 'components/CoinDisplay'
import CurrencyDisplay from 'components/CurrencyDisplay'

const ButtonAmount = (props) => {
  const { coinDisplayed, handleClick, transaction } = props
  const nature = transaction.type.toLowerCase()

  return (
    <Button nature={nature} onClick={handleClick} fullwidth>
      { coinDisplayed
        ? <CoinDisplay light white>{transaction.amount}</CoinDisplay>
        : <CurrencyDisplay light white>{transaction.amount}</CurrencyDisplay>
      }
    </Button>
  )
}

ButtonAmount.propTypes = {
  handleClick: PropTypes.func.isRequired,
  coinDisplayed: PropTypes.bool.isRequired,
  transaction: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['Sent', 'Transferred', 'Received'])
  })
}

export default ButtonAmount
