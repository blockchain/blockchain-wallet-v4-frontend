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
  border: 1px solid #CCCCCC;

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
  const { coinValue, fiatValue, coinUnit, fiatUnit, handleCoinChange, handleFiatChange } = props

  return (
    <Wrapper>
      <TextBoxContainer>
        <TextBox onChange={handleCoinChange} value={coinValue} />
        <TextBoxUnit>{coinUnit}</TextBoxUnit>
      </TextBoxContainer>
      <IconArrow />
      <TextBoxContainer>
        <TextBox onChange={handleFiatChange} value={fiatValue} />
        <TextBoxUnit>{fiatUnit}</TextBoxUnit>
      </TextBoxContainer>
    </Wrapper>
  )
}

CoinConvertor.propTypes = {
  coinValue: PropTypes.number,
  fiatValue: PropTypes.number,
  coinUnit: PropTypes.string.isRequired,
  fiatUnit: PropTypes.string.isRequired,
  handleCoinChange: PropTypes.func.isRequired,
  handleFiatChange: PropTypes.func.isRequired
}

export default CoinConvertor
