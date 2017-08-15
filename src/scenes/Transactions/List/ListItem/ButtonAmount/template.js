import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Button } from 'blockchain-components'
import CoinDisplay from 'components/shared/CoinDisplay'
import CurrencyDisplay from 'components/shared/CurrencyDisplay'

const ButtonSent = styled(Button)`
  width: 200px;
  background-color: #F26C57;
  &:hover { background-color : #F0573F; }
`
const ButtonTransferred = styled(Button)`
  width: 200px;
  background-color: #799EB2;
  &:hover { background-color : #6992A9; }
`
const ButtonReceived = styled(Button)`
  width: 200px;
  background-color: #00BABC;
  &:hover { background-color : #00A1A3; }
`

const ButtonAmount = (props) => {
  const { coinDisplayed, handleClick, transaction } = props

  switch (transaction.type) {
    case 'Sent': {
      return coinDisplayed
        ? <ButtonSent onClick={handleClick} fullwidth>
          <CoinDisplay light white>{transaction.amount}</CoinDisplay>
        </ButtonSent>
        : <ButtonSent onClick={handleClick} fullwidth>
          <CurrencyDisplay light white>{transaction.amount}</CurrencyDisplay>
        </ButtonSent>
    }
    case 'Transferred': {
      return coinDisplayed
        ? <ButtonTransferred onClick={handleClick} fullwidth>
          <CoinDisplay light white>{transaction.amount}</CoinDisplay>
        </ButtonTransferred>
        : <ButtonTransferred onClick={handleClick} fullwidth>
          <CurrencyDisplay light white>{transaction.amount}</CurrencyDisplay>
        </ButtonTransferred>
    }
    default:
      return coinDisplayed
        ? <ButtonReceived onClick={handleClick} fullwidth>
          <CoinDisplay light white>{transaction.amount}</CoinDisplay>
        </ButtonReceived>
        : <ButtonReceived onClick={handleClick} fullwidth>
          <CurrencyDisplay light white>{transaction.amount}</CurrencyDisplay>
        </ButtonReceived>
  }
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
