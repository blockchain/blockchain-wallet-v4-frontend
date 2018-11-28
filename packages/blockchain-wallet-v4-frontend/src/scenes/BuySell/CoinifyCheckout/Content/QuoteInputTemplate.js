import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { equals, prop } from 'ramda'

import { Icon } from 'blockchain-info-components'
import { SelectBoxCoinifyCurrency, NumberBoxDebounced } from 'components/Form'
import { getReasonExplanation } from 'services/CoinifyService'
import media from 'services/ResponsiveService'
import LimitsAndErrorText from './LimitsAndErrorText'

const Wrapper = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Montserrat', Helvetica, sans-serif;
  ${media.mobile`
    height: 100px;
  `};
`
const FiatConvertorInput = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-bottom: 0px;
  ${media.mobile`
    flex-direction: column;
  `};
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
  font-size: 14px;
  font-weight: 300;
  position: absolute;
  color: ${props => props.theme['gray-4']};
`
const ArrowLeft = styled(Icon)`
  margin-left: 10px;
  color: #bbb;
  ${media.mobile`
    display: none;
  `};
`
const ArrowRight = styled(Icon)`
  margin-left: -10px;
  margin-right: 10px;
  color: #bbb;
  ${media.mobile`
    display: none;
  `};
`

const FiatConvertor = props => {
  const {
    val,
    changeTab,
    disabled,
    setMax,
    setMin,
    limits,
    checkoutError,
    defaultCurrency,
    symbol,
    increaseLimit,
    form
  } = props
  const currency = 'BTC'
  const level = val.level || { name: 1 }
  const kyc = prop('kyc', val)
  const { canTrade, cannotTradeReason, canTradeAfter } = val
  const isSell = form === 'coinifyCheckoutSell'
  const curr = isSell ? 'BTC' : symbol

  const reasonExplanation =
    cannotTradeReason && getReasonExplanation(cannotTradeReason, canTradeAfter)

  const inputsDisabled =
    disabled ||
    (!canTrade && !isSell) ||
    equals(checkoutError, 'effective_max_under_min')

  return (
    <Wrapper>
      <FiatConvertorInput>
        <Container>
          <Field
            name='leftVal'
            component={NumberBoxDebounced}
            disabled={inputsDisabled}
            borderRightNone={1}
            currency
          />
          <Field
            name='currency'
            component={SelectBoxCoinifyCurrency}
            defaultDisplay={defaultCurrency}
            isSell={isSell}
          />
        </Container>
        <ArrowLeft size='16px' name='left-arrow' />
        <ArrowRight size='16px' name='right-arrow' />
        <Container>
          <Field
            name='rightVal'
            component={NumberBoxDebounced}
            disabled={inputsDisabled}
          />
          <Unit>{currency}</Unit>
        </Container>
      </FiatConvertorInput>
      <LimitsAndErrorText
        isSell={isSell}
        canTrade={canTrade}
        reasonExplanation={reasonExplanation}
        checkoutError={checkoutError}
        limits={limits}
        curr={curr}
        setMax={setMax}
        setMin={setMin}
        changeTab={changeTab}
        level={level}
        increaseLimit={increaseLimit}
        kyc={kyc}
      />
    </Wrapper>
  )
}

FiatConvertor.propTypes = {
  defaultCurrency: PropTypes.string.isRequired,
  checkoutError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  symbol: PropTypes.string.isRequired,
  limits: PropTypes.object.isRequired,
  setMax: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}

export const QuoteInputTemplateBuy = reduxForm({
  form: 'coinifyCheckoutBuy',
  destroyOnUnmount: false
})(FiatConvertor)
export const QuoteInputTemplateSell = reduxForm({
  form: 'coinifyCheckoutSell',
  destroyOnUnmount: false
})(FiatConvertor)
