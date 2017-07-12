import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon } from 'components/generic/Icon'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const TextBoxContainer = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`
const TextBox = styled.input.attrs({
  placeholder: '0',
  type: 'number'
})`
  display: block;
  width: 100%;
  height: 100%;
  min-height: 40px;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.42;
  color: #555555;
  background-color: #FFFFFF;
  background-image: none;
  outline-width: 0;
  user-select: text;

  &::-webkit-input-placeholder { color: #A8A8A8; }
`
const TextBoxUnit = styled.span`
  position: absolute;
  padding: 0 15px;
  color: #A8A8A8;
`

const IconArrow = styled(Icon).attrs({
  name: 'ti-arrows-horizontal'
})`
  font-size: 20px;
  width: 20px;
  margin: 0 5px;
`

const CoinConvertor = (props) => {
  console.log(props)
  const { coinValue, currencyValue, coinUnit, currencyUnit, handleCoinChange, handleCurrencyChange } = props

  return (
    <Wrapper>
      <TextBoxContainer>
        <TextBox onChange={handleCoinChange} value={coinValue} />
        <TextBoxUnit>{coinUnit}</TextBoxUnit>
      </TextBoxContainer>
      <IconArrow />
      <TextBoxContainer>
        <TextBox onChange={handleCurrencyChange} value={currencyValue} />
        <TextBoxUnit>{currencyUnit}</TextBoxUnit>
      </TextBoxContainer>
    </Wrapper>
  )
}

CoinConvertor.propTypes = {
  coinValue: PropTypes.number,
  currencyValue: PropTypes.number,
  coinUnit: PropTypes.string.isRequired,
  currencyUnit: PropTypes.string.isRequired,
  handleCoinChange: PropTypes.func.isRequired,
  handleCurrencyChange: PropTypes.func.isRequired
}

export default CoinConvertor
