import React from 'react'

import { Exchange } from '@core'
// @ts-ignore
import { TextInput } from 'blockchain-info-components'

import { Container, Equals, Error, FiatConverterInput, Unit, Wrapper } from './Converter.styles'
import { ConverterPropsType } from './Converter.types'
import { getErrorState } from './Converter.utils'

const Converter: React.FC<ConverterPropsType> = (props) => {
  const {
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

  const showError = !!(meta.touched && meta.error)
  return (
    <Wrapper showError={showError}>
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
          data-e2e='fiatConverterError'
          showError={showError}
        >
          {meta.error}
        </Error>
      )}
    </Wrapper>
  )
}

export default Converter
