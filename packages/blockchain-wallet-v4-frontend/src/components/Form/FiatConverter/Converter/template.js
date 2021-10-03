import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Text, TextInput } from 'blockchain-info-components'
import { Exchange } from 'blockchain-wallet-v4/src'

const Wrapper = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`
const FiatConverterInput = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-bottom: 0;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : '')};
`
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`
const Unit = styled.span`
  padding: 0 15px;
  font-size: 12px;
  font-weight: 500;
  position: absolute;
  color: ${(props) => props.theme['text-black']};
`
const Equals = styled(Text)`
  margin: 0 8px;
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  font-size: 12px;
  height: 15px;
  top: ${(props) => (props.errorBottom ? '40px' : '-20px')};
  right: 0;
`
const getErrorState = (meta) => {
  return meta.touched && meta.invalid ? 'invalid' : 'initial'
}

const Converter = (props) => {
  const {
    className,
    coin,
    coinTicker,
    currency,
    disabled,
    errorBottom,
    fiat,
    handleBlur,
    handleCoinChange,
    handleFiatChange,
    handleFocus,
    marginTop,
    meta
  } = props
  const errorState = getErrorState(meta)

  return (
    <Wrapper className={className}>
      <FiatConverterInput marginTop={marginTop}>
        <Container>
          <TextInput
            value={fiat}
            disabled={disabled}
            placeholder={`${Exchange.getSymbol(currency)}0.00`}
            onBlur={handleBlur}
            onChange={handleFiatChange}
            onFocus={handleFocus}
            errorState={errorState}
            data-e2e={`${props['data-e2e']}FiatAmount`}
            noLastPass
          />
          <Unit>{currency}</Unit>
        </Container>
        <Equals color='textBlack'>=</Equals>
        <Container>
          <TextInput
            value={coin}
            disabled={disabled}
            placeholder='0'
            onBlur={handleBlur}
            onChange={handleCoinChange}
            onFocus={handleFocus}
            errorState={errorState}
            data-e2e={`${props['data-e2e']}CryptoAmount`}
            noLastPass
          />
          <Unit>{coinTicker}</Unit>
        </Container>
      </FiatConverterInput>
      {meta.touched && meta.error && (
        <Error
          errorBottom={errorBottom}
          size='13px'
          weight={400}
          color='error'
          className='error'
          data-e2e='fiatConverterError'
        >
          {meta.error}
        </Error>
      )}
    </Wrapper>
  )
}

Converter.propTypes = {
  coin: PropTypes.string,
  currency: PropTypes.string.isRequired,
  fiat: PropTypes.string,
  handleBlur: PropTypes.func.isRequired,
  handleCoinChange: PropTypes.func.isRequired,
  handleFiatChange: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired,
  unit: PropTypes.string.isRequired
}

export default Converter
