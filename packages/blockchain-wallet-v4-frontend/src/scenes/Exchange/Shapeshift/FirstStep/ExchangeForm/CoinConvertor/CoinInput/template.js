import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { TextInput } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`
const CoinContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 40px;
`
const FiatContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 40px;
`
const Unit = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 100%;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: ${props => props.theme['gray-4']};
`

const CoinInput = props => {
  const { coinValue, fiatValue, coinUnit, fiatUnit, handleChangeCoin, handleChangeFiat, disabled } = props

  return (
    <Wrapper>
      <CoinContainer>
        <TextInput onChange={handleChangeCoin} value={coinValue} disabled={disabled} />
        <Unit>{coinUnit}</Unit>
      </CoinContainer>
      <FiatContainer>
        <TextInput onChange={handleChangeFiat} value={fiatValue} disabled={disabled} />
        <Unit>{fiatUnit}</Unit>
      </FiatContainer>
    </Wrapper>
  )
}

CoinInput.propTypes = {
  coinValue: PropTypes.string.isRequired,
  fiatValue: PropTypes.string.isRequired,
  coinUnit: PropTypes.string.isRequired,
  fiatUnit: PropTypes.string.isRequired,
  handleCoinChange: PropTypes.func.isRequired,
  handleFiatChange: PropTypes.func.isRequired
}

export default CoinInput
