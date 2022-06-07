import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'
import { intervalToDuration } from 'date-fns'
import { defaultTo, filter, path, prop } from 'ramda'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { coinToString, fiatToString } from '@core/exchange/utils'
import { BSPaymentTypes, FiatType, MobilePaymentType, OrderType, WalletFiatType } from '@core/types'
import {
  Button,
  CheckBoxInput,
  HeartbeatLoader,
  Icon,
  Link,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { ErrorCartridge } from 'components/Cartridge'
import { FlyoutWrapper, Row } from 'components/Flyout'
import { getPeriodSubTitleText, getPeriodTitleText } from 'components/Flyout/model'
import Form from 'components/Form/Form'
import { model } from 'data'
import {
  getBaseAmount,
  getBaseCurrency,
  getCounterAmount,
  getCounterCurrency,
  getFiatFromPair,
  getOrderType,
  getPaymentMethodId
} from 'data/components/buySell/model'
import { convertBaseToStandard } from 'data/components/exchange/services'
import {
  AddBankStepType,
  BankPartners,
  BankTransferAccountType,
  BrokerageModalOriginType,
  RecurringBuyPeriods,
  UserDataType
} from 'data/types'
import { useDefer3rdPartyScript } from 'hooks'

import {
  displayFiat,
  getLockRuleMessaging,
  getPaymentMethod,
  getPaymentMethodDetails
} from '../model'
import { Props as OwnProps, SuccessStateType } from '.'

const { FORM_BS_CHECKOUT_CONFIRM } = model.components.buySell

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
`
const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  padding-top: 30px;
  height: 100%;
  border-top: 1px solid ${(props) => props.theme.grey000};
`
const Info = styled.div`
  display: flex;
  align-items: center;
`
const InfoTerms = styled(Text)`
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  a {
    color: ${(props) => props.theme.blue600};
    cursor: pointer;
    text-decoration: none;
    display: contents;
  }
`
const Amount = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  > div {
    display: flex;
    flex-direction: row;
  }
`
const RowItem = styled(Row)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const RowIcon = styled.div`
  display: flex;
  flex-direction: row;
`

const RowItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  margin-left: 4px;
`

const RowTextWrapper = styled.div`
  text-align: right;
`

const RowText = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.grey900};
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const AdditionalText = styled(Text)`
  font-weight: 500;
  color: ${(props) => props.theme.grey400};
  text-align: right;
  font-size: 14px;
`
const ToolTipText = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 8px;
  margin-top: 8px;
  padding: 16px;
  background-color: ${(props) => props.theme.grey000};

  animation: fadeIn 0.3s ease-in-out;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

const StickyFooter = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2.5rem;
  justify-content: flex-start;
  background: ${(props) => props.theme.white};
`

const Success: React.FC<InjectedFormProps<{ form: string }, Props> & Props> = (props) => {
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isActiveCoinTooltip, setCoinToolTip] = useState(false)
  const [isActiveFeeTooltip, setFeeToolTip] = useState(true)

  const [isGooglePayReady] = useDefer3rdPartyScript('https://pay.google.com/gp/p/js/pay.js', {
    attributes: {
      nonce: window.nonce
    }
  })

  const orderType = getOrderType(props.order)
  const baseAmount = getBaseAmount(props.order)

  const baseCurrency = getBaseCurrency(props.order)
  const baseCurrencyCoinfig = window.coins[baseCurrency]?.coinfig
  const baseCurrencyDisplay = baseCurrencyCoinfig?.displaySymbol || baseCurrency
  const counterAmount = getCounterAmount(props.order)
  const counterCurrency = getCounterCurrency(props.order)
  const paymentMethodId = getPaymentMethodId(props.order)

  const requiresTerms =
    props.order.paymentType === BSPaymentTypes.PAYMENT_CARD ||
    props.order.paymentType === BSPaymentTypes.USER_CARD

  const [bankAccount] = filter(
    (b: BankTransferAccountType) => b.state === 'ACTIVE' && b.id === paymentMethodId,
    defaultTo([])(path(['bankAccounts'], props))
  )

  const showLock = (props.withdrawLockCheck && props.withdrawLockCheck.lockTime > 0) || false
  const days = showLock
    ? (intervalToDuration({ end: props.withdrawLockCheck?.lockTime || 0, start: 0 }).days as number)
    : 0

  const cardDetails =
    (requiresTerms && props.cards.filter((card) => card.id === paymentMethodId)[0]) || null

  const isCardPayment = requiresTerms && cardDetails

  const totalAmount = fiatToString({
    unit: counterCurrency as FiatType,
    value: counterAmount
  })

  useEffect(() => {
    if (!requiresTerms) {
      setAcceptTerms(true)
    }
  }, [requiresTerms])

  useEffect(() => {
    props.buySellActions.fetchBuyQuote({
      amount: props.order.inputQuantity,
      pair: props.order.pair,
      paymentMethod:
        props.order.paymentType === undefined ? BSPaymentTypes.FUNDS : props.order.paymentType,
      paymentMethodId: props.order.paymentMethodId
    })
  }, [
    props.buySellActions,
    props.order.inputQuantity,
    props.order.pair,
    props.order.paymentMethodId,
    props.order.paymentType
  ])

  const handleCancel = () => {
    props.buySellActions.cancelOrder(props.order)
  }

  const handleSubmit = () => {
    const { bankAccounts, cards, isSddFlow, isUserSddVerified, sbBalances, userData } =
      props.data.getOrElse({
        isSddFlow: false,
        userData: { tiers: { current: 0 } } as UserDataType
      } as SuccessStateType)

    const userTier = userData?.tiers?.current
    const inputCurrency = props.order.inputCurrency as WalletFiatType
    // check for SDD flow and direct to add card
    if (isSddFlow && props.order.paymentType === BSPaymentTypes.PAYMENT_CARD) {
      if (isUserSddVerified) {
        // user has to have at least one active card
        if (cards && cards.length > 0 && cards[0].state === 'ACTIVE') {
          const card = cards[0]
          return props.buySellActions.confirmOrder({
            order: props.order,
            paymentMethodId: card.id
          })
        }
        return props.buySellActions.setStep({
          step: 'DETERMINE_CARD_PROVIDER'
        })
      }
      return props.buySellActions.setStep({
        step: 'KYC_REQUIRED'
      })
    }

    if (userTier < 2) {
      return props.buySellActions.setStep({
        step: 'KYC_REQUIRED'
      })
    }

    switch (props.order.paymentType) {
      case BSPaymentTypes.FUNDS:
        const available = sbBalances[inputCurrency]?.available || '0'
        if (new BigNumber(available).isGreaterThanOrEqualTo(props.order.inputQuantity)) {
          return props.buySellActions.confirmFundsOrder()
        }
        return props.buySellActions.setStep({
          displayBack: false,
          fiatCurrency: inputCurrency,
          step: 'BANK_WIRE_DETAILS'
        })

      case BSPaymentTypes.PAYMENT_CARD:
        let { paymentMethodId } = props.order

        if (props.mobilePaymentMethod === MobilePaymentType.APPLE_PAY && props.applePayInfo) {
          paymentMethodId = props.applePayInfo.beneficiaryID
        }

        if (props.mobilePaymentMethod === MobilePaymentType.GOOGLE_PAY && props.googlePayInfo) {
          paymentMethodId = props.googlePayInfo.beneficiaryID
        }

        if (paymentMethodId) {
          return props.buySellActions.confirmOrder({
            mobilePaymentMethod: props.mobilePaymentMethod,
            order: props.order,
            paymentMethodId
          })
        }

        break

      case BSPaymentTypes.BANK_TRANSFER:
        const [bankAccount] = filter(
          (b: BankTransferAccountType) =>
            b.state === 'ACTIVE' && b.id === props.order.paymentMethodId,
          defaultTo([])(bankAccounts)
        )
        const paymentPartner = prop('partner', bankAccount)
        // if yapily we need the auth screen before creating the order
        if (paymentPartner === BankPartners.YAPILY) {
          return props.buySellActions.setStep({
            step: 'AUTHORIZE_PAYMENT'
          })
        }
        if (props.order.paymentMethodId) {
          return props.buySellActions.confirmOrder({
            order: props.order,
            paymentMethodId: props.order.paymentMethodId
          })
        }
        props.brokerageActions.showModal({
          modalType: 'ADD_BANK_YODLEE_MODAL',
          origin: BrokerageModalOriginType.ADD_BANK_BUY
        })
        return props.brokerageActions.setAddBankStep({
          addBankStep: AddBankStepType.ADD_BANK_HANDLER
        })

      default:
        // Not a valid payment method type, go back to CRYPTO_SELECTION
        return props.buySellActions.setStep({
          fiatCurrency: getFiatFromPair(props.order.pair),
          step: 'CRYPTO_SELECTION'
        })
    }
  }

  return (
    <CustomForm onSubmit={handleSubmit}>
      <FlyoutWrapper>
        <TopText color='grey800' size='20px' weight={600}>
          <Icon
            cursor
            data-e2e='sbBackToEnterAmount'
            name='arrow-back'
            size='20px'
            color='grey600'
            style={{ marginRight: '8px' }}
            role='button'
            onClick={handleCancel}
          />
          <FormattedMessage id='modals.simplebuy.checkoutconfirm' defaultMessage='Checkout' />
        </TopText>
        <Amount data-e2e='sbTotalAmount'>
          <div>
            <Text size='32px' weight={600} color='grey800'>
              {`${baseAmount} ${baseCurrencyDisplay}`}
            </Text>
          </div>
          <div>
            <Text size='20px' weight={600} color='grey600' style={{ marginTop: '8px' }}>
              {totalAmount}
            </Text>
          </div>
        </Amount>
      </FlyoutWrapper>

      <RowItem>
        <RowItemContainer>
          <TopRow>
            <RowIcon>
              <RowText>
                <FormattedMessage
                  id='modals.simplebuy.confirm.coin_price'
                  defaultMessage='{coin} Price'
                  values={{
                    coin: baseCurrencyDisplay
                  }}
                />
              </RowText>
              <IconWrapper>
                <Icon
                  name='question-in-circle-filled'
                  size='16px'
                  color={isActiveCoinTooltip ? 'blue600' : 'grey300'}
                  onClick={() => setCoinToolTip(!isActiveCoinTooltip)}
                />
              </IconWrapper>
            </RowIcon>
            <RowText data-e2e='sbExchangeRate'>
              {fiatToString({
                unit: counterCurrency as FiatType,
                value:
                  (1 /
                    parseFloat(props.quote.rate.toString()) /
                    parseFloat(convertBaseToStandard(baseCurrency, props.quote.rate.toString()))) *
                  parseFloat(props.quote.rate.toString())
              })}
            </RowText>
          </TopRow>
          {isActiveCoinTooltip && (
            <ToolTipText>
              <Text size='12px' weight={500} color='grey600'>
                <TextGroup inline>
                  <Text size='14px'>
                    <FormattedMessage
                      id='modals.simplebuy.confirm.coin_tooltip'
                      defaultMessage='Blockchain.com provides the best market price we receive and applies a spread.'
                    />
                  </Text>
                  <Link
                    href='https://support.blockchain.com/hc/en-us/articles/360061672651-Wallet-Pricing'
                    size='14px'
                    rel='noopener noreferrer'
                    target='_blank'
                  >
                    <FormattedMessage
                      id='modals.simplebuy.summary.learn_more'
                      defaultMessage='Learn more'
                    />
                  </Link>
                </TextGroup>
              </Text>
            </ToolTipText>
          )}
        </RowItemContainer>
      </RowItem>

      {props.formValues?.period && (
        <RowItem>
          <RowText>
            <FormattedMessage id='copy.frequency' defaultMessage='Frequency' />
          </RowText>
          <RowText>
            <RowTextWrapper>
              {getPeriodTitleText(props.formValues?.period || RecurringBuyPeriods.ONE_TIME)}
              <AdditionalText>
                {getPeriodSubTitleText(props.formValues?.period || RecurringBuyPeriods.ONE_TIME)}
              </AdditionalText>
            </RowTextWrapper>
          </RowText>
        </RowItem>
      )}

      <RowItem>
        <RowText>
          <FormattedMessage id='modals.simplebuy.confirm.payment' defaultMessage='Payment Method' />
        </RowText>
        <RowText>
          <RowTextWrapper>
            {getPaymentMethod({
              bankAccount,
              mobilePaymentMethod: props.mobilePaymentMethod,
              order: props.order
            })}
            <AdditionalText>
              {getPaymentMethodDetails({
                bankAccount,
                cardDetails,
                order: props.order
              })}
            </AdditionalText>
          </RowTextWrapper>
        </RowText>
      </RowItem>
      <>
        <RowItem>
          <RowText>
            <FormattedMessage id='modals.simplebuy.confirm.purchase' defaultMessage='Purchase' />
          </RowText>
          <RowText>
            <RowTextWrapper data-e2e='sbFee'>
              {props.order.fee && props.formValues?.fix === 'FIAT'
                ? displayFiat(
                    props.order,
                    (parseInt(props.order.inputQuantity) - parseInt(props.order.fee)).toString()
                  )
                : props.order.fee && props.formValues?.fix === 'CRYPTO'
                ? coinToString({
                    unit: { symbol: props.order.outputCurrency },
                    value: convertBaseToStandard(
                      props.order.outputCurrency,
                      parseInt(props.order.outputQuantity) - parseInt(props.order.fee)
                    )
                  })
                : `${displayFiat(
                    props.order,
                    (parseInt(props.order.inputQuantity) - parseInt(props.quote.fee)).toString()
                  )} ${props.order.inputCurrency}`}
            </RowTextWrapper>
          </RowText>
        </RowItem>
        <RowItem>
          <RowItemContainer>
            <TopRow>
              <RowIcon>
                <RowText>
                  <FormattedMessage id='copy.blockchain_fee' defaultMessage='Blockchain.com Fee' />
                </RowText>
                <IconWrapper>
                  <Icon
                    name='question-in-circle-filled'
                    size='16px'
                    color={isActiveFeeTooltip ? 'blue600' : 'grey300'}
                    onClick={() => setFeeToolTip(!isActiveFeeTooltip)}
                  />
                </IconWrapper>
              </RowIcon>
              <RowText data-e2e='sbFee'>
                {props.order.fee && props.formValues?.fix === 'FIAT'
                  ? displayFiat(props.order, props.order.fee)
                  : props.order.fee && props.formValues?.fix === 'CRYPTO'
                  ? coinToString({
                      unit: { symbol: props.order.inputCurrency },
                      value: convertBaseToStandard(props.order.inputCurrency, props.order.fee)
                    })
                  : `${displayFiat(props.order, props.quote.fee)} ${props.order.inputCurrency}`}
              </RowText>
            </TopRow>
            {isActiveFeeTooltip && (
              <ToolTipText>
                <Text size='12px' weight={500} color='grey600'>
                  <TextGroup inline>
                    <Text size='14px'>
                      <FormattedMessage
                        id='modals.simplebuy.flexible_pricing'
                        defaultMessage='This fee is based on trade size, payment method and asset being purchased on Blockchain.com'
                      />
                    </Text>
                  </TextGroup>
                </Text>
              </ToolTipText>
            )}
          </RowItemContainer>
        </RowItem>
      </>

      <RowItem>
        <RowText>
          <FormattedMessage id='copy.total' defaultMessage='Total' />
        </RowText>
        <RowText>
          <RowTextWrapper>
            <div data-e2e='sbFiatBuyAmount'>{totalAmount}</div>
            <AdditionalText>{`${baseAmount} ${baseCurrencyDisplay}`}</AdditionalText>
          </RowTextWrapper>
        </RowText>
      </RowItem>

      <Bottom>
        {getLockRuleMessaging(showLock, days, props.order.paymentType)}

        {requiresTerms && (
          <Info>
            <InfoTerms size='12px' weight={500} color='grey900' data-e2e='sbAcceptTerms'>
              <CheckBoxInput
                name='sbAcceptTerms'
                checked={acceptTerms}
                data-e2e='sbAcceptTermsCheckbox'
                onChange={() => setAcceptTerms((acceptTerms) => !acceptTerms)}
              >
                <FormattedMessage
                  id='modals.simplebuy.confirm.activity_accept_terms1'
                  defaultMessage='I agree to Blockchain’s <a>Terms of Service</a> and its return, refund and cancellation policy.'
                  values={{
                    a: (msg) => (
                      <a
                        href='https://www.blockchain.com/legal/terms'
                        rel='noopener noreferrer'
                        target='_blank'
                      >
                        {msg}
                      </a>
                    )
                  }}
                />
              </CheckBoxInput>
            </InfoTerms>
          </Info>
        )}
      </Bottom>

      <StickyFooter>
        <Button
          fullwidth
          nature='primary'
          data-e2e='confirmBSOrder'
          size='16px'
          height='48px'
          type='submit'
          style={{ marginTop: '28px' }}
          disabled={
            props.submitting ||
            !acceptTerms ||
            (props.mobilePaymentMethod === MobilePaymentType.GOOGLE_PAY && !isGooglePayReady)
          }
        >
          {props.submitting ? (
            <HeartbeatLoader height='16px' width='16px' color='white' />
          ) : (
            <FormattedMessage
              id='buttons.buy_sell_now'
              defaultMessage='{orderType} Now'
              values={{ orderType: orderType === OrderType.BUY ? 'Buy' : 'Sell' }}
            />
          )}
        </Button>

        {props.error && (
          <ErrorCartridge style={{ marginTop: '16px' }} data-e2e='checkoutError'>
            <Icon name='alert-filled' color='red600' style={{ marginRight: '4px' }} />
            Error: {props.error}
          </ErrorCartridge>
        )}
      </StickyFooter>
    </CustomForm>
  )
}

type Props = OwnProps & SuccessStateType

export default reduxForm<{ form: string }, Props>({ form: FORM_BS_CHECKOUT_CONFIRM })(Success)
