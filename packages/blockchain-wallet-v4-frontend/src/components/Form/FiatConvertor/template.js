import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon, TextInput, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 40px;
`
const FiatConvertorInput = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
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
  position: absolute;
  padding: 0 15px;
  color: ${props => props.theme['gray-4']};
`
const ArrowLeft = styled(Icon)`
  margin-left: 5px;
`
const ArrowRight = styled(Icon)`
  margin-left: -10px;
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

const FiatConvertor = (props) => {
  const { coinValue, fiatValue, coinUnit, fiatUnit, handleBlur, handleCoinChange, handleFiatChange, handleFocus, meta } = props
  const errorState = getErrorState(meta)

  return (
    <Wrapper>
      <FiatConvertorInput>
        <Container>
          <TextInput onBlur={handleBlur} onChange={handleCoinChange} onFocus={handleFocus} value={coinValue} errorState={errorState} />
          <Unit>{coinUnit}</Unit>
        </Container>
        <ArrowLeft size='16px' name='left-arrow' />
        <ArrowRight size='16px' name='right-arrow' />
        <Container>
          <TextInput onBlur={handleBlur} onChange={handleFiatChange} onFocus={handleFocus} value={fiatValue} errorState={errorState} />
          <Unit>{fiatUnit}</Unit>
        </Container>
      </FiatConvertorInput>
      {meta.touched && meta.error && <Error size='13px' weight={300} color='error'>{meta.error}</Error>}
    </Wrapper>
  )
}

FiatConvertor.propTypes = {
  coinValue: PropTypes.string,
  fiatValue: PropTypes.string,
  coinUnit: PropTypes.string.isRequired,
  fiatUnit: PropTypes.string.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleCoinChange: PropTypes.func.isRequired,
  handleFiatChange: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired
}

export default FiatConvertor
