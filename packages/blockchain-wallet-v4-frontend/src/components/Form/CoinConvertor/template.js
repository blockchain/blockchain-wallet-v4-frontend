import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon, TextInput, Text } from 'blockchain-info-components'
import CurrencyDisplay from 'components/CurrencyDisplay'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`
const CoinConvertorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

const FiatDisplay = styled(Text)`
  padding-left: 10px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`

const OutputRow = styled(Row)`
  border: 1px solid ${props => props.theme['gray-2']};
  border-top: none;
  height: 30px;
  justify-content: flex-start;
`

const Unit = styled.span`
  padding: 0 15px;
  color: ${props => props.theme['gray-4']};
`
const ArrowRight = styled(Icon)`
  margin-left: 5px;
  margin-right: 5px;
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  top: -18px;
  right: 0;
  height: 15px;
`
const getErrorState = (meta) => {
  return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
}

const CoinConvertor = (props) => {
  const { value, toValue, currency, btcUnit, ethUnit, fromCoin, toCoin, bitcoinRates, ethereumRates, handleBlur, handleFromCoinChange, handleToCoinChange, handleFocus, meta } = props
  const errorState = getErrorState(meta)

  return (
    <Wrapper>
      <CoinConvertorContainer>
        <Container>
          <Row>
            <TextInput onBlur={handleBlur} onChange={handleFromCoinChange} onFocus={handleFocus} value={value} errorState={errorState} />
            <Unit>{fromCoin === 'BTC' ? btcUnit : ethUnit}</Unit>
          </Row>
          <OutputRow>
            <FiatDisplay weight={300} size='14px'>
              <CurrencyDisplay coin='BTC' unit='BTC' currency={currency} bitcoinRates={bitcoinRates}>
                {value}
              </CurrencyDisplay>
            </FiatDisplay>
          </OutputRow>
        </Container>
        <ArrowRight size='12px' name='right-arrow' />
        <Container>
          <Row>
            <TextInput onBlur={handleBlur} onChange={handleToCoinChange} onFocus={handleFocus} value={toValue} errorState={errorState} />
            <Unit>{toCoin === 'BTC' ? btcUnit : ethUnit}</Unit>
          </Row>
          <OutputRow>
            <FiatDisplay weight={300} size='14px'>
              <CurrencyDisplay coin='ETH' unit='ETH' currency={currency} ethereumRates={ethereumRates}>
                {toValue}
              </CurrencyDisplay>
            </FiatDisplay>
          </OutputRow>
        </Container>
      </CoinConvertorContainer>
      {meta.touched && meta.error && <Error size='13px' weight={300} color='error'>{meta.error}</Error>}
    </Wrapper>
  )
}

CoinConvertor.propTypes = {
  fromCoin: PropTypes.string,
  toCoin: PropTypes.string.isRequired,
  toValue: PropTypes.string,
  btcUnit: PropTypes.string.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleFromCoinChange: PropTypes.func.isRequired,
  handleToCoinChange: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired
}

export default CoinConvertor
