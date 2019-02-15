import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon, TextInput, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Montserrat', Helvetica, sans-serif;
`
const FiatConvertorInput = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-bottom: 0px;
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
  font-weight: 300;
  position: absolute;
  color: ${props => props.theme['gray-4']};
`
const ArrowLeft = styled(Icon)`
  margin-left: 10px;
  color: #bbb;
`
const ArrowRight = styled(Icon)`
  margin-left: -10px;
  margin-right: 10px;
  color: #bbb;
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  font-size: 12px;
  height: 15px;
  top: ${props => (props.errorBottom ? '40px' : '-20px')};
  right: 0;
`
const getErrorState = meta => {
  return meta.touched && meta.invalid ? 'invalid' : 'initial'
}

const Convertor = props => {
  const {
    coin,
    disabled,
    fiat,
    unit,
    currency,
    meta,
    errorBottom,
    handleCoinChange,
    handleFiatChange,
    handleBlur,
    handleFocus,
    className
  } = props
  const errorState = getErrorState(meta)

  return (
    <Wrapper className={className}>
      <FiatConvertorInput>
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
          />
          <Unit>{unit}</Unit>
        </Container>
        <ArrowLeft size='16px' name='left-arrow' />
        <ArrowRight size='16px' name='right-arrow' />
        <Container>
          <TextInput
            value={fiat}
            disabled={disabled}
            placeholder='0'
            onBlur={handleBlur}
            onChange={handleFiatChange}
            onFocus={handleFocus}
            errorState={errorState}
            data-e2e={`${props['data-e2e']}FiatAmount`}
          />
          <Unit>{currency}</Unit>
        </Container>
      </FiatConvertorInput>
      {meta.touched && meta.error && (
        <Error
          errorBottom={errorBottom}
          size='13px'
          weight={300}
          color='error'
          className='error'
          data-e2e='fiatConvertorError'
        >
          {meta.error}
        </Error>
      )}
    </Wrapper>
  )
}

Convertor.propTypes = {
  coin: PropTypes.string,
  fiat: PropTypes.string,
  unit: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleCoinChange: PropTypes.func.isRequired,
  handleFiatChange: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired
}

export default Convertor
