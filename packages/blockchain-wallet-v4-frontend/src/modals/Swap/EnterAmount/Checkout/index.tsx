import { Button, Text } from 'blockchain-info-components'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

import { AmountTextBox } from 'components/Exchange'
import { BlueCartridge, ErrorCartridge } from 'components/Cartridge'
import { fiatToString } from 'core/exchange/currency'
import { FlyoutWrapper } from 'components/Flyout'
import { formatTextAmount } from 'services/ValidationHelper'
import { getMaxMin, maximumAmount, minimumAmount } from './validation'
import { GreyBlueCartridge } from 'blockchain-wallet-v4-frontend/src/modals/Interest/DepositForm/model'
import { Props as OwnProps, SuccessStateType } from '..'
import { Row } from 'blockchain-wallet-v4-frontend/src/scenes/Exchange/ExchangeForm/Layout'
import { StyledForm } from '../../components'
import { SwapAccountType } from 'data/types'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

const AmountRow = styled(Row)`
  position: relative;
  padding: 12px;
  justify-content: center;
  border: 0px;
`
const Amounts = styled.div`
  margin-top: 52px;
  display: flex;
  justify-content: space-between;
`
const MinMaxButtons = styled.div`
  display: flex;
`
const ButtonsRow = styled(MinMaxButtons)`
  justify-content: space-between;
  width: 105%;
  ${media.mobile`
    flex-direction: column;
    width: 100%;
    align-items: center;
  `};
`
const CoinBalance = styled.div`
  margin-top: 2px;
  display: flex;
`
const UpgradePrompt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Errors = styled.div`
  margin: 32px 0 24px 0;
  display: flex;
  justify-content: center;
`
const QuoteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const CustomErrorCartridge = styled(ErrorCartridge)`
  border: 1px solid ${props => props.theme.red000};
  cursor: pointer;
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

const resizeSymbol = (isFiat, inputNode, fontSizeRatio, fontSizeNumber) => {
  const amountRowNode = inputNode.closest('#amount-row')
  const currencyNode = isFiat
    ? amountRowNode.children[0]
    : amountRowNode.children[amountRowNode.children.length - 1]
  currencyNode.style.fontSize = `${fontSizeNumber * fontSizeRatio}px`
}

const Checkout: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const amtError =
    typeof props.formErrors.amount === 'string' && props.formErrors.amount
  const max = getMaxMin(
    'max',
    props.limits,
    props.rates[props.walletCurrency],
    props.payment,
    props.BASE
  )
  const min = getMaxMin(
    'min',
    props.limits,
    props.rates[props.walletCurrency],
    props.payment,
    props.BASE
  )
  const balance = props.payment
    ? props.payment.effectiveBalance
    : props.BASE.balance

  let maxAmountSilver = true
  // props.userData.tiers.current === 1 &&
  // amtError === 'ABOVE_MAX' &&
  // props.limits.maxPossibleOrder < props.limits.maxOrder
  //   ? true
  //   : false

  const handleMinMaxClick = () => {
    const value = amtError === 'BELOW_MIN' ? min : max
    props.formActions.change('swapAmount', 'amount', value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    props.swapActions.setStep({ step: 'PREVIEW_SWAP' })
  }
  return (
    <FlyoutWrapper style={{ paddingTop: '0px' }}>
      <StyledForm onSubmit={handleSubmit}>
        <AmountRow id='amount-row'>
          <Field
            data-e2e='swapAmountInput'
            name='amount'
            component={AmountTextBox}
            validate={[maximumAmount, minimumAmount]}
            normalize={normalizeAmount}
            onUpdate={resizeSymbol.bind(null, false)}
            maxFontSize='56px'
            placeholder='0'
            fiatActive={false}
            {...{
              autoFocus: true,
              hideError: true
            }}
          />
          <Text size={'56px'} color='textBlack' weight={500}>
            {props.BASE.coin}
          </Text>
        </AmountRow>

        <QuoteRow>
          <div />
          <Text
            color='grey600'
            size='14px'
            weight={500}
            data-e2e='swapQuoteAmount'
          >
            {fiatToString({
              value:
                props.rates[props.walletCurrency].last *
                Number(props.formValues?.amount || 0),
              unit: props.walletCurrency
            })}
          </Text>
          <div />
        </QuoteRow>
        {amtError && (
          <Errors>
            <>
              {amtError === 'BELOW_MIN' ? (
                <CustomErrorCartridge
                  onClick={handleMinMaxClick}
                  role='button'
                  data-e2e='swapMin'
                >
                  <FormattedMessage
                    id='copy.below_swap_min'
                    defaultMessage='Minimum Swap is {value}'
                    values={{
                      value: `${min} ${props.BASE.coin}`
                    }}
                  />
                </CustomErrorCartridge>
              ) : maxAmountSilver ? (
                <UpgradePrompt>
                  <BlueCartridge style={{ marginBottom: '26px' }}>
                    <FormattedMessage
                      id='copy.above_swap_max_silver'
                      defaultMessage='Upgrade your profile to swap this amount.'
                    />
                  </BlueCartridge>
                  <ButtonsRow>
                    <Button
                      data-e2e='swapUpgradePromptNotNow'
                      nature='light'
                      onClick={handleMinMaxClick}
                      height='48px'
                      width='192px'
                    >
                      <FormattedMessage
                        id='copy.not_now'
                        defaultMessage='Not Now'
                      />
                    </Button>
                    <Button
                      data-e2e='swapLimitUpgradePrompt'
                      nature='primary'
                      onClick={() =>
                        props.idvActions.verifyIdentity(
                          2,
                          false,
                          'SwapLimitPrompt'
                        )
                      }
                      height='48px'
                      width='192px'
                    >
                      <FormattedMessage
                        id='scenes.exchange.exchangeform.limit_info.upgrade'
                        defaultMessage='Upgrade'
                      />
                    </Button>
                  </ButtonsRow>
                </UpgradePrompt>
              ) : (
                <CustomErrorCartridge
                  onClick={handleMinMaxClick}
                  role='button'
                  data-e2e='swapMax'
                >
                  <FormattedMessage
                    id='copy.above_swap_max'
                    defaultMessage='Maximum Swap is {value}'
                    values={{
                      value: `${max} ${props.BASE.coin}`
                    }}
                  />
                </CustomErrorCartridge>
              )}
            </>
          </Errors>
        )}
        <Amounts>
          <div>
            <Text size='14px' weight={500} color='grey600'>
              {props.BASE.coin}{' '}
              <FormattedMessage
                id='copy.available'
                defaultMessage='Available'
              />
            </Text>
            <CoinBalance>
              <CoinDisplay
                size='14px'
                weight={500}
                color='grey900'
                coin={props.BASE.coin}
              >
                {balance}
              </CoinDisplay>
              <Text size='14px' weight={500} color='grey600'>
                &nbsp;(
              </Text>
              <FiatDisplay
                size='14px'
                weight={500}
                color='grey600'
                coin={props.BASE.coin}
              >
                {balance}
              </FiatDisplay>
              <Text size='14px' weight={500} color='grey600'>
                )
              </Text>
            </CoinBalance>
          </div>
          <MinMaxButtons>
            <GreyBlueCartridge
              role='button'
              data-e2e='swapMin'
              onClick={() =>
                props.formActions.change('swapAmount', 'amount', min)
              }
            >
              <FormattedMessage
                id='buttons.swap_min'
                defaultMessage='Swap Min'
              />
            </GreyBlueCartridge>
            <GreyBlueCartridge
              role='button'
              data-e2e='swapMax'
              onClick={() =>
                props.formActions.change('swapAmount', 'amount', max)
              }
            >
              <FormattedMessage
                id='buttons.swap_max'
                defaultMessage='Swap Max'
              />
            </GreyBlueCartridge>
          </MinMaxButtons>
        </Amounts>
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

export type Props = OwnProps & SuccessStateType & { BASE: SwapAccountType }

export default reduxForm<{}, Props>({
  form: 'swapAmount',
  destroyOnUnmount: false
})(Checkout)
