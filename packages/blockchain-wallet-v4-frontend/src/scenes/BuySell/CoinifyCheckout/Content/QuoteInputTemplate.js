import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon, TextInput, Text } from 'blockchain-info-components'
import { SelectBoxCoinifyCurrency } from 'components/Form'

import { Field, reduxForm } from 'redux-form'

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
  top: 42px;
  right: 0;
`
const getErrorState = (meta) => {
  return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
}

const getLimitsError = (val, limits, disabled, fiat) => {
  if (!val || !fiat) return
  if ((limits.max < limits.min) && disabled) return `Your limit of $${limits.max} is below the minimum allowed amount.`
  if (val > limits.max) return `Enter an amount under your $${limits.max.toLocaleString()} limit`
  if (val < limits.min) return `Enter an amount above the $${limits.min.toLocaleString()} minimum`
  if ((fiat * 1e8) > limits.effectiveMax) return `Enter an amount less than your balance minus the priority fee (${limits.effectiveMax / 1e8} BTC)`
}

const FiatConvertor = (props) => {
  const { value, fiat, disabled, handleBlur, handleCoinChange, handleFiatChange, handleFocus, handleErrorClick, meta, limits, defaultCurrency } = props
  const { currency, unit } = props.data.data
  const errorState = getErrorState(meta)

  return (
    <form>
      <Wrapper>
        <FiatConvertorInput>
          <Container>
            <TextInput placeholder='0' onBlur={handleBlur} onChange={handleCoinChange} onFocus={handleFocus} value={value} errorState={errorState} disabled={disabled} />
            {/* <Unit>{unit}</Unit> */}
            <Field name='currency' component={SelectBoxCoinifyCurrency} defaultDisplay={defaultCurrency} />
          </Container>
          <ArrowLeft size='16px' name='left-arrow' />
          <ArrowRight size='16px' name='right-arrow' />
          <Container>
            <TextInput placeholder='0' onBlur={handleBlur} onChange={handleFiatChange} onFocus={handleFocus} value={fiat} errorState={errorState} disabled={disabled} />
            <Unit>{currency}</Unit>
          </Container>
        </FiatConvertorInput>
        {meta.touched && meta.error && <Error onClick={handleErrorClick} size='13px' weight={300} color='error'>{meta.error}</Error>}
        {
          limits && <Error size='13px' weight={300} color='error'>
            { getLimitsError(value, limits, disabled, fiat) }
          </Error>
        }
      </Wrapper>
    </form>
  )
}

FiatConvertor.propTypes = {
  coin: PropTypes.string,
  fiat: PropTypes.string,
  unit: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  handleBlur: PropTypes.func.isRequired,
  handleCoinChange: PropTypes.func.isRequired,
  handleFiatChange: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired,
  handleErrorClick: PropTypes.func
}

export default reduxForm({ form: 'coinifyCheckout' })(FiatConvertor)
