import { Button, Icon, Text } from 'blockchain-info-components'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import React from 'react'
import styled from 'styled-components'

import { AmountTextBox } from 'components/Exchange'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { formatTextAmount } from 'services/ValidationHelper'
import { maximumAmount, minimumAmount } from './validation'
import { Props as OwnProps, SuccessStateType } from '..'
import { Row } from 'blockchain-wallet-v4-frontend/src/scenes/Exchange/ExchangeForm/Layout'
import { StyledForm } from '../../components'

const AmountRow = styled(Row)`
  position: relative;
  padding: 24px;
  justify-content: center;
  border: 0px;
`
const QuoteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const normalizeAmount = (
  value,
  prevValue /* allValues: SwapAmountFormValues */
) => {
  if (isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
  return formatTextAmount(
    value,
    /* allValues && allValues.fix === 'FIAT' */ false
  )
}

const Checkout: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  return (
    <FlyoutWrapper style={{ paddingTop: '0px' }}>
      <StyledForm>
        <AmountRow id='amount-row'>
          {/* {fix === 'FIAT' && (
      <Text size={'56px'} color='textBlack' weight={500}>
        {Currencies[fiatCurrency].units[fiatCurrency].symbol}
      </Text>
    )} */}
          <Field
            data-e2e='swapAmountInput'
            name='amount'
            component={AmountTextBox}
            validate={[maximumAmount, minimumAmount]}
            normalize={normalizeAmount}
            maxFontSize='56px'
            placeholder='0'
            fiatActive
            {...{
              autoFocus: true,
              hideError: true
            }}
          />
          {/* {fix === 'CRYPTO' && (
      <Text size={'56px'} color='textBlack' weight={500}>
        {cryptoCurrency}
      </Text>
    )} */}
        </AmountRow>

        <QuoteRow>
          <div />
          <Text
            color='grey600'
            size='14px'
            weight={500}
            data-e2e='swapQuoteAmount'
          >
            {props.rates[props.walletCurrency].last *
              Number(props.formValues?.amount || 0)}
          </Text>
          <Icon
            color='blue600'
            cursor
            name='vertical-arrow-switch'
            role='button'
            size='24px'
            data-e2e='swapSwitchIcon'
          />
        </QuoteRow>
        <Button
          nature='primary'
          data-e2e='previewSwap'
          type='submit'
          jumbo
          fullwidth
          style={{ marginTop: '24px' }}
          disabled={props.invalid}
        >
          <FormattedMessage
            id='buttons.preview_swap'
            defaultMessage='Preview Swap'
          />
        </Button>
      </StyledForm>
    </FlyoutWrapper>
  )
}

export type Props = OwnProps & SuccessStateType

export default reduxForm<{}, Props>({
  form: 'swapAmount',
  destroyOnUnmount: false
})(Checkout)
