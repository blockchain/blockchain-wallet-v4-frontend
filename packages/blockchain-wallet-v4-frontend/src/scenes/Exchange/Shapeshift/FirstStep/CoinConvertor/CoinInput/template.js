import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  border: 1px solid  ${props => props.theme[props.borderColor]};
`
const TextInput = styled.input.attrs({ type: 'text' })`
  display: block;
  width: 100%;
  height: 40px;
  min-height: 40px;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.42;
  color: ${props => props.theme['gray-5']};
  background-color: ${props => props.disabled ? props.theme['gray-1'] : props.theme['white']};
  background-image: none;
  outline-width: 0;
  user-select: text;
  cursor: ${props => props.disabled ? 'not-allowed' : 'cursor'};

  &::-webkit-input-placeholder {
    color: ${props => props.theme['gray-2']};
  }
`
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 40px;

  & > input { 
    border: none;
    border-bottom: 1px solid ${props => props.theme['gray-1']};
  }
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

const selectBorderColor = (state) => {
  switch (state) {
    case 'initial': return 'gray-2'
    case 'invalid': return 'error'
    case 'valid': return 'success'
    default: return 'gray-2'
  }
}

const CoinInput = props => {
  const { coinValue, fiatValue, coinUnit, fiatUnit, handleChangeCoin, handleChangeFiat, disabled, errorState } = props
  const borderColor = selectBorderColor(errorState)

  return (
    <Wrapper borderColor={borderColor}>
      <Container>
        <TextInput onChange={handleChangeCoin} value={coinValue} disabled={disabled} />
        <Unit>{coinUnit}</Unit>
      </Container>
      <Container>
        <TextInput onChange={handleChangeFiat} value={fiatValue} disabled={disabled} />
        <Unit>{fiatUnit}</Unit>
      </Container>
    </Wrapper>
  )
}

CoinInput.propTypes = {
  coinValue: PropTypes.string.isRequired,
  fiatValue: PropTypes.string.isRequired,
  coinUnit: PropTypes.string.isRequired,
  fiatUnit: PropTypes.string.isRequired,
  handleChangeCoin: PropTypes.func.isRequired,
  handleChangeFiat: PropTypes.func.isRequired
}

export default CoinInput
