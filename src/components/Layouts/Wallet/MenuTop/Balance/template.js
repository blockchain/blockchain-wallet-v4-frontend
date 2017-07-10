import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import BitcoinDisplay from 'components/shared/BitcoinDisplay'
import CurrencyDisplay from 'components/shared/CurrencyDisplay'

const Wrapper = styled.div`
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
  <Wrapper flip={!bitcoinDisplayed}>
    <Currency onClick={toggleCurrencyDisplay} large={bitcoinDisplayed}>
      <BitcoinDisplay amount={balance} />
    </Currency>
    <Currency onClick={toggleCurrencyDisplay} large={!bitcoinDisplayed}>
      <CurrencyDisplay amount={balance} />
    </Currency>
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
