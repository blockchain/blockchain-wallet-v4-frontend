import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon, NumberInput, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 40px;
`
const CoinConvertorInput = styled.div`
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
  color: ${props => props.theme['basicgrey']};
`
const Arrow = styled(Icon)`
  font-size: 16px;
`
const ArrowLeft = styled(Arrow)`
  margin-left: 5px;
`
const ArrowRight = styled(Arrow)`
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

const CoinConvertor = (props) => {
  const { coinValue, fiatValue, coinUnit, fiatUnit, handleBlur, handleChange, handleFiatChange, handleFocus, meta } = props
  const errorState = getErrorState(meta)

  return (
    <Wrapper>
      <CoinConvertorInput>
        <Container>
          <NumberInput onBlur={handleBlur} onChange={handleChange} onFocus={handleFocus} value={coinValue} errorState={errorState} />
          <Unit>{coinUnit}</Unit>
        </Container>
        <ArrowLeft name='left_arrow' />
        <ArrowRight name='right_arrow' />
        <Container>
          <NumberInput onBlur={handleBlur} onChange={handleFiatChange} onFocus={handleFocus} value={fiatValue} errorState={errorState} />
          <Unit>{fiatUnit}</Unit>
        </Container>
      </CoinConvertorInput>
      {meta.touched && meta.error && <Error size='13px' weight={300} color='error'>{meta.error}</Error>}
    </Wrapper>
  )
}

CoinConvertor.propTypes = {
  coinValue: PropTypes.number,
  fiatValue: PropTypes.number,
  coinUnit: PropTypes.string.isRequired,
  fiatUnit: PropTypes.string.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleFiatChange: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired
}

export default CoinConvertor
