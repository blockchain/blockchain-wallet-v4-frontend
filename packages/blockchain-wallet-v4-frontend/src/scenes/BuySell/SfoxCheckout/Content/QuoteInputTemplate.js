import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StepTransition } from 'components/Utilities/Stepper'
import { spacing } from 'services/StyleService'
import { FormattedMessage } from 'react-intl'
import { Remote } from 'blockchain-wallet-v4/src'

import { Icon, TextInput, Text, Button } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
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
  @media (max-width: 480px) {
    flex-direction: column;
    div:first-of-type {
      margin-bottom: 25px;
    }
  }
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
  @media (max-width: 480px) {
    display: none;
  }
`
const ArrowRight = styled(Icon)`
  margin-left: -10px;
  margin-right: 10px;
  color: #bbb;
  @media (max-width: 480px) {
    display: none;
  }
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  font-size: 12px;
  height: 15px;
  top: 42px;
  right: 0;
`
const ButtonWrapper = styled.div`
  width: 100%;
`
const getErrorState = (meta) => {
  return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
}

const getLimitsError = (val, limits, disabledReason, fiat, cryptoMax) => {
  if (limits.max < limits.min) return `Your limit of $${limits.max} is below the minimum allowed amount.`
  if (disabledReason === 'not_enough_funds') return `There are not enough funds to meet the sell minimum of $${limits.min.toLocaleString()}`
  if ((val && val > limits.max) || (fiat > cryptoMax)) return `Enter an amount under your $${limits.max.toLocaleString()} limit`
  if (val && val < limits.min) return `Enter an amount above the $${limits.min.toLocaleString()} minimum`
  if (!val || !fiat) return
  if ((fiat * 1e8) > limits.effectiveMax) return `Enter an amount less than your balance minus the priority fee (${limits.effectiveMax / 1e8} BTC)`
}

const limitsHelper = (quoteR, limits) => {
  if (quoteR.error) return true
  return quoteR.map(q => {
    if (q.baseCurrency === 'USD') return +q.baseAmount > limits.max || +q.baseAmount < limits.min || +q.quoteAmount > limits.effectiveMax
    if (q.baseCurrency === 'BTC') return +q.quoteAmount > limits.max || +q.quoteAmount < limits.min || +q.baseAmount > limits.effectiveMax
  }).data
}

const FiatConvertor = (props) => {
  const { value, fiat, disabled, handleBlur, handleCoinChange, handleFiatChange, handleFocus, handleErrorClick, meta, limits, quoteR, reason, cryptoMax } = props
  const { currency, unit } = props.data.data
  const errorState = getErrorState(meta)
  const disabledReason = disabled()

  return (
    <Wrapper>
      <FiatConvertorInput>
        <Container>
          <TextInput placeholder='0' onBlur={handleBlur} onChange={handleCoinChange} onFocus={handleFocus} value={value} errorState={errorState} disabled={disabledReason} />
          <Unit>{unit}</Unit>
        </Container>
        <ArrowLeft size='16px' name='left-arrow' />
        <ArrowRight size='16px' name='right-arrow' />
        <Container>
          <TextInput placeholder='0' onBlur={handleBlur} onChange={handleFiatChange} onFocus={handleFocus} value={fiat} errorState={errorState} disabled={disabledReason} />
          <Unit>{currency}</Unit>
        </Container>
      </FiatConvertorInput>
      {meta.touched && meta.error && <Error onClick={handleErrorClick} size='13px' weight={300} color='error'>{meta.error}</Error>}
      {
        limits && <Error size='13px' weight={300} color='error'>
          { getLimitsError(value, limits, disabledReason, fiat, cryptoMax) }
        </Error>
      }
      {
        reason.indexOf('has_remaining') > -1
          ? <ButtonWrapper>
            <StepTransition next Component={Button} style={spacing('mt-35')} nature='primary' fullwidth disabled={!Remote.Success.is(quoteR) || !value || !fiat || limitsHelper(quoteR, limits) || getLimitsError(value, limits, disabledReason, fiat, cryptoMax)}>
              <FormattedMessage id='buy.sfoxcheckout.revieworder' defaultMessage='Review Order' />
            </StepTransition>
          </ButtonWrapper>
          : null
      }
    </Wrapper>
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

export default FiatConvertor
