import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import BitcoinDisplay from 'components/shared/BitcoinDisplay'
import CurrencyDisplay from 'components/shared/CurrencyDisplay'

const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column${props => props.flip ? '-reverse' : ''};
  justify-content: center;
  align-items: center;
`

const Balance = ({ balance, bitcoinDisplayed, toggleCurrencyDisplay }) => (
  <Wrapper flip={!bitcoinDisplayed} onClick={toggleCurrencyDisplay}>
    <BitcoinDisplay amount={balance} biggest={bitcoinDisplayed} big={!bitcoinDisplayed} />
    <CurrencyDisplay amount={balance} biggest={!bitcoinDisplayed} big={bitcoinDisplayed} />
  </Wrapper>
)

Balance.defaultProps = {
  balance: 0
}

Balance.propTypes = {
  balance: PropTypes.number.isRequired,
  toggleCurrencyDisplay: PropTypes.func.isRequired
}

export default Balance
