import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon, NumberBox, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`
const CoinConvertorInput = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
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
  color: #A8A8A8;
`
const Arrow = styled(Icon)`
  font-size: 20px;
  width: 20px;
  margin: 0 5px;
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  bottom: 5px;
  left: 0;
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
          <NumberBox onBlur={handleBlur} onChange={handleChange} onFocus={handleFocus} value={coinValue} errorState={errorState} />
          <Unit>{coinUnit}</Unit>
        </Container>
        <Arrow name='ti-arrows-horizontal' />
        <Container>
          <NumberBox onBlur={handleBlur} onChange={handleFiatChange} onFocus={handleFocus} value={fiatValue} errorState={errorState} />
          <Unit>{fiatUnit}</Unit>
        </Container>
      </CoinConvertorInput>
      {meta.touched && meta.error && <Error size='13px' weight={300} color='red'>{meta.error}</Error>}
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
