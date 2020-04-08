import { equals } from 'ramda'
import { Field, reduxForm } from 'redux-form'
import { NumberBoxDebounced, SelectBoxCoinifyCurrency } from 'components/Form'
import media from 'services/ResponsiveService'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  ${media.mobile`
    height: 100px;
  `};
`
const FiatConverterInput = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
  font-size: 18px;
  font-weight: 400;
  position: absolute;
  color: ${props => props.theme.grey200};
  padding-right: 42px;
`

const FiatConverter = props => {
  const {
    val,
    disabled,
    checkoutError,
    defaultCurrency,
    form,
    verified
  } = props
  const { canTrade } = val
  const currency = 'BTC'
  const isSell = form === 'coinifyCheckoutSell'

  const inputsDisabled =
    !verified ||
    disabled ||
    (!canTrade && !isSell) ||
    equals(checkoutError, 'effective_max_under_min')

  const BORDER_COLOR = 'grey000'
  const HEIGHT = '72px'
  const FONT_SIZE = '18px'
  const FONT_COLOR = checkoutError ? 'error' : 'blue900'

  return (
    <Wrapper>
      <FiatConverterInput>
        <Container>
          <Field
            name='leftVal'
            component={NumberBoxDebounced}
            disabled={inputsDisabled}
            borderRightNone={1}
            currency
            height={HEIGHT}
            color={FONT_COLOR}
            size={FONT_SIZE}
            borderColor={BORDER_COLOR}
            paddingLeft='25px'
          />
          <Field
            name='currency'
            component={SelectBoxCoinifyCurrency}
            defaultDisplay={defaultCurrency}
            borderColor={BORDER_COLOR}
            disabled={inputsDisabled}
          />
        </Container>
        <Container>
          <Field
            name='rightVal'
            component={NumberBoxDebounced}
            disabled={inputsDisabled}
            height={HEIGHT}
            borderTopNone
            color={FONT_COLOR}
            size={FONT_SIZE}
            borderColor={BORDER_COLOR}
          />
          <Unit>{currency}</Unit>
        </Container>
      </FiatConverterInput>
    </Wrapper>
  )
}

FiatConverter.propTypes = {
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
})(FiatConverter)
export const QuoteInputTemplateSell = reduxForm({
  form: 'coinifyCheckoutSell',
  destroyOnUnmount: false
})(FiatConverter)
