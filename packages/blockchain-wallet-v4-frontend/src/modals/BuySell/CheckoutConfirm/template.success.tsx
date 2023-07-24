import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { intervalToDuration } from 'date-fns'
import { defaultTo, filter, path, prop } from 'ramda'
import { clearSubmitErrors, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { BSPaymentTypes, MobilePaymentType, WalletFiatType } from '@core/types'
import { CheckBoxInput, Icon, Link, Text, TextGroup } from 'blockchain-info-components'
import AvailabilityRows from 'components/Brokerage/AvailabilityRows'
import { ErrorCartridge } from 'components/Cartridge'
import { FlyoutWrapper, Row } from 'components/Flyout'
import { getPeriodSubTitleText, getPeriodTitleText } from 'components/Flyout/model'
import Form from 'components/Form/Form'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { model } from 'data'
import {
  AddBankStepType,
  Analytics,
  BankPartners,
  BankTransferAccountType,
  BrokerageModalOriginType,
  ModalName,
  RecurringBuyPeriods
} from 'data/types'
import { useDefer3rdPartyScript, useSardineContext } from 'hooks'
import { isNabuError } from 'services/errors'

import { QuoteCountDown } from '../../components/QuoteCountDown'
import { getLockRuleMessaging, getPaymentMethod, getPaymentMethodDetails } from '../model'
import { Props as OwnProps, SuccessStateType } from '.'
import { ConfirmButton } from './ConfirmButton'

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
const QuoteCountDownWrapper = styled.div`
  margin-top: 28px;
`
const Amount = styled.div`
  margin-top: 8px;
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

const ButtonWrapper = styled.div`
  margin-top: 28px;
`

const Success: React.FC<InjectedFormProps<{ form: string }, Props> & Props> = (props) => {
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isActiveCoinTooltip, setIsActiveCoinTooltip] = useState(false)
  const [isActiveFeeTooltip, setIsActiveFeeTooltip] = useState(true)
  const dispatch = useDispatch()
  const [sardineContextIsReady, sardineContext] = useSardineContext('ACH_LINK')
  const [sardineContextIsReadyOB, sardineContextOB] = useSardineContext('OB_LINK')

  const [isGooglePayReady] = useDefer3rdPartyScript('https://pay.google.com/gp/p/js/pay.js', {
    attributes: {
      nonce: window.nonce
    }
  })

  const { paymentMethodId } = props.quoteSummaryViewModel

  const [bankAccount] = filter(
    (b: BankTransferAccountType) => b.state === 'ACTIVE' && b.id === paymentMethodId,
    defaultTo([])(path(['bankAccounts'], props))
  )

  const showLock = (props.withdrawLockCheck && props.withdrawLockCheck.lockTime > 0) || false
  const days = showLock
    ? (intervalToDuration({ end: props.withdrawLockCheck?.lockTime || 0, start: 0 }).days as number)
    : 0

  const cardDetails =
    (props.quoteSummaryViewModel.isTermsConsentRequired &&
      props.cards.filter((card) => card.id === paymentMethodId)[0]) ||
    null

  useEffect(() => {
    props.analyticsActions.trackEvent({
      key: Analytics.BUY_CHECKOUT_SCREEN_VIEWED,
      properties: {}
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!props.quoteSummaryViewModel.isTermsConsentRequired) {
      setAcceptTerms(true)
    }
  }, [props.quoteSummaryViewModel.isTermsConsentRequired])

  const handleCancel = () => {
    props.buySellActions.returnToBuyEnterAmount({
      pair: props.quoteSummaryViewModel.quoteState.pairObject
    })

    props.analyticsActions.trackEvent({
      key: Analytics.BUY_CHECKOUT_SCREEN_BACK_CLICKED,
      properties: {}
    })
  }

  const clearFormErrors = () => dispatch(clearSubmitErrors(FORM_BS_CHECKOUT_CONFIRM))

  const handleSubmit = (e) => {
    e.preventDefault()

    props.analyticsActions.trackEvent({
      key: Analytics.BUY_CHECKOUT_SCREEN_SUBMITTED,
      properties: {}
    })

    const { bankAccounts, cards, sbBalances } = props.data.getOrElse({} as SuccessStateType)

    const inputCurrency = props.quoteSummaryViewModel.fiatCode as WalletFiatType

    switch (props.quoteSummaryViewModel.paymentMethod) {
      case BSPaymentTypes.FUNDS:
        const available = sbBalances[inputCurrency]?.available || '0'
        if (
          new BigNumber(available).isGreaterThanOrEqualTo(
            props.quoteSummaryViewModel.fiatAmountBase
          )
        ) {
          return props.buySellActions.confirmFundsOrder({
            quoteState: props.quoteSummaryViewModel.quoteState
          })
        }
        return props.buySellActions.setStep({
          displayBack: false,
          fiatCurrency: inputCurrency,
          step: 'BANK_WIRE_DETAILS'
        })

      case BSPaymentTypes.PAYMENT_CARD:
        if (props.quoteSummaryViewModel.paymentMethodId) {
          return props.buySellActions.confirmOrder({
            mobilePaymentMethod: props.mobilePaymentMethod,
            paymentMethodId: props.quoteSummaryViewModel.paymentMethodId,
            quoteState: props.quoteSummaryViewModel.quoteState
          })
        }

        break

      case BSPaymentTypes.BANK_TRANSFER:
        const [bankAccount] = filter(
          (b: BankTransferAccountType) =>
            b.state === 'ACTIVE' && b.id === props.quoteSummaryViewModel.paymentMethodId,
          defaultTo([])(bankAccounts)
        )
        const paymentPartner = prop('partner', bankAccount)
        if (sardineContextIsReady) {
          sardineContext.updateConfig({
            flow: 'ACH_LINK'
          })
        }
        // if yapily we need the auth screen before creating the order
        if (paymentPartner === BankPartners.YAPILY) {
          if (sardineContextIsReadyOB) {
            sardineContextOB.updateConfig({
              flow: 'OB_LINK'
            })
          }
          return props.buySellActions.setStep({
            step: 'AUTHORIZE_PAYMENT'
          })
        }
        if (props.quoteSummaryViewModel.paymentMethodId) {
          return props.buySellActions.confirmOrder({
            paymentMethodId: props.quoteSummaryViewModel.paymentMethodId,
            quoteState: props.quoteSummaryViewModel.quoteState
          })
        }
        props.brokerageActions.showModal({
          modalType: ModalName.ADD_BANK_YODLEE_MODAL,
          origin: BrokerageModalOriginType.ADD_BANK_BUY
        })
        return props.brokerageActions.setAddBankStep({
          addBankStep: AddBankStepType.ADD_BANK_HANDLER
        })

      default:
        return props.buySellActions.returnToCryptoSelection()
    }
  }

  const toggleCoinTooltip = () => {
    setIsActiveCoinTooltip((prevState) => !prevState)

    props.analyticsActions.trackEvent({
      key: Analytics.BUY_PRICE_TOOLTIP_CLICKED,
      properties: {}
    })
  }

  const toggleFeeTooltip = () => {
    setIsActiveFeeTooltip((prevState) => !prevState)

    props.analyticsActions.trackEvent({
      key: Analytics.BUY_BLOCKCHAIN_COM_FEE_CLICKED,
      properties: {}
    })
  }

  if (isNabuError(props.error)) {
    return <GenericNabuErrorFlyout error={props.error} onDismiss={clearFormErrors} />
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
        <QuoteCountDownWrapper>
          <QuoteCountDown
            date={props.quoteSummaryViewModel.refreshConfig.date}
            totalMs={props.quoteSummaryViewModel.refreshConfig.totalMs}
          />
        </QuoteCountDownWrapper>
        <Amount data-e2e='sbTotalAmount'>
          <Text size='32px' weight={600} color='grey800'>
            {props.quoteSummaryViewModel.totalCryptoText}
          </Text>
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
                    coin: props.quoteSummaryViewModel.cryptoDisplaySymbol
                  }}
                />
              </RowText>
              <IconWrapper>
                <Icon
                  name='question-in-circle-filled'
                  size='16px'
                  color={isActiveCoinTooltip ? 'blue600' : 'grey300'}
                  onClick={toggleCoinTooltip}
                />
              </IconWrapper>
            </RowIcon>
            <RowText data-e2e='sbExchangeRate'>{props.quoteSummaryViewModel.oneCoinPrice}</RowText>
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
              fiatCode: props.quoteSummaryViewModel.fiatCode,
              mobilePaymentMethod: props.mobilePaymentMethod,
              paymentType: props.quoteSummaryViewModel.paymentMethod
            })}
            <AdditionalText>
              {!props.mobilePaymentMethod
                ? getPaymentMethodDetails({
                    bankAccount,
                    cardDetails,
                    paymentType: props.quoteSummaryViewModel.paymentMethod
                  })
                : null}
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
            <RowTextWrapper data-e2e='sbPurchase'>
              {props.quoteSummaryViewModel.fiatMinusExplicitFeeText}
              <AdditionalText>{props.quoteSummaryViewModel.totalCryptoText}</AdditionalText>
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
                    onClick={toggleFeeTooltip}
                  />
                </IconWrapper>
              </RowIcon>
              <RowText data-e2e='sbFee'>{props.quoteSummaryViewModel.feeText}</RowText>
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
            <div data-e2e='sbFiatBuyAmount'>{props.quoteSummaryViewModel.totalFiatText}</div>
          </RowTextWrapper>
        </RowText>
      </RowItem>

      {props.availableToTradeWithdraw && (
        <AvailabilityRows depositTerms={props.quoteSummaryViewModel.depositTerms} />
      )}

      <Bottom>
        {getLockRuleMessaging({
          coin: props.quoteSummaryViewModel.cryptoDisplaySymbol,
          days,
          paymentAccount: getPaymentMethodDetails({
            bankAccount,
            cardDetails,
            paymentType: props.quoteSummaryViewModel.paymentMethod
          }),
          paymentType: props.quoteSummaryViewModel.paymentMethod,
          quoteRate: props.quoteSummaryViewModel.oneCoinPrice,
          showLockRule: showLock,
          totalAmount: props.quoteSummaryViewModel.totalFiatText,
          withdrawalLockDays: props.quoteSummaryViewModel.depositTerms?.withdrawalLockDays || days
        })}

        {props.quoteSummaryViewModel.isTermsConsentRequired && (
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
        <ButtonWrapper>
          <ConfirmButton
            isAcceptedTerms={acceptTerms}
            isGooglePayReady={isGooglePayReady}
            isSubmitting={props.submitting}
            refreshConfig={props.quoteSummaryViewModel.refreshConfig}
          />
        </ButtonWrapper>

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
