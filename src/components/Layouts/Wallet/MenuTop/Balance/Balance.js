import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import BitcoinDisplay from 'components/Shared/BitcoinDisplay'
import CurrencyDisplay from 'components/Shared/CurrencyDisplay'

const BalanceWrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column${props => props.flip ? '-reverse' : ''}
`

const Currency = styled.div.attrs({
  className: (props) => (
    `row justify-content-start justify-content-md-end ${props.large ? 'f-28' : 'f-24'}`
  )
})``

const Balance = ({ balance, bitcoinDisplayed, toggleCurrencyDisplay }) => (
  <BalanceWrapper flip={!bitcoinDisplayed}>
    <Currency onClick={toggleCurrencyDisplay} large={bitcoinDisplayed}>
      <BitcoinDisplay amount={balance} />
    </Currency>
    <Currency onClick={toggleCurrencyDisplay} large={!bitcoinDisplayed}>
      <CurrencyDisplay amount={balance} />
    </Currency>
  </BalanceWrapper>
)

Balance.defaultProps = {
  balance: 0
}

Balance.propTypes = {
  balance: PropTypes.number.isRequired,
  toggleCurrencyDisplay: PropTypes.func.isRequired
}

export default Balance
