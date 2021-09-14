import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import { defaultTo, filter, path, prop } from 'ramda'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  Button,
  CheckBoxInput,
  HeartbeatLoader,
  Icon,
  Link,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import { FiatType, OrderType, SBPaymentTypes } from 'blockchain-wallet-v4/src/types'
import { ErrorCartridge } from 'components/Cartridge'
import { FlyoutWrapper, getPeriodSubTitleText, getPeriodTitleText, Row } from 'components/Flyout'
import { Form } from 'components/Form'
import {
  getBaseAmount,
  getBaseCurrency,
  getCounterAmount,
  getCounterCurrency,
  getOrderType,
  getPaymentMethodId
} from 'data/components/simpleBuy/model'
import { BankPartners, BankTransferAccountType, RecurringBuyPeriods } from 'data/types'

import {
  displayFiat,
  getLockRuleMessaging,
  getPaymentMethod,
  getPaymentMethodDetails
} from '../model'
import { Props as OwnProps, SuccessStateType } from '.'

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

const BottomActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: 1;
`

const Success: React.FC<InjectedFormProps<{ form: string }, Props> & Props> = (props) => {
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isActiveCoinTooltip, setCoinToolTip] = useState(false)
  const [isActiveFeeTooltip, setFeeToolTip] = useState(false)
  const orderType = getOrderType(props.order)
  const baseAmount = getBaseAmount(props.order)
  const baseCurrency = getBaseCurrency(props.order)
  const baseCurrencyCoinfig = window.coins[baseCurrency]?.coinfig
  const baseCurrencyDisplay = baseCurrencyCoinfig?.displaySymbol || baseCurrency
  const counterAmount = getCounterAmount(props.order)
  const counterCurrency = getCounterCurrency(props.order)
  const paymentMethodId = getPaymentMethodId(props.order)
  const requiresTerms =
    props.order.paymentType === SBPaymentTypes.PAYMENT_CARD ||
    props.order.paymentType === SBPaymentTypes.USER_CARD
  const [bankAccount] = filter(
    (b: BankTransferAccountType) => b.state === 'ACTIVE' && b.id === paymentMethodId,
    defaultTo([])(path(['bankAccounts'], props))
  )
  const paymentPartner = prop('partner', bankAccount)

  const showLock = (props.withdrawLockCheck && props.withdrawLockCheck.lockTime > 0) || false
  const days = showLock ? moment.duration(props.withdrawLockCheck?.lockTime, 'seconds').days() : 0

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

  const handleCancel = () => {
    props.simpleBuyActions.cancelSBOrder(props.order)
  }

  const paymentPartnerButton =
    paymentPartner === BankPartners.YAPILY ? (
      <FormattedMessage id='copy.next' defaultMessage='Next' />
    ) : (
      `${orderType === OrderType.BUY ? 'Buy' : 'Sell'} ${baseAmount} ${baseCurrencyDisplay}`
    )
  return (
    <CustomForm onSubmit={props.handleSubmit}>
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
              {displayFiat(props.order, props.quote.rate)}
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
            {getPaymentMethod(props.order, bankAccount)}
            <AdditionalText>
              {getPaymentMethodDetails(props.order, bankAccount, cardDetails)}
            </AdditionalText>
          </RowTextWrapper>
        </RowText>
      </RowItem>
      {isCardPayment && (
        <RowItem>
          <RowItemContainer>
            <TopRow>
              <RowIcon>
                <RowText>
                  <FormattedMessage id='copy.card_fee' defaultMessage='Card Fee' />
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
                {props.order.fee
                  ? displayFiat(props.order, props.order.fee)
                  : `${displayFiat(props.order, props.quote.fee)} ${props.order.inputCurrency}`}
              </RowText>
            </TopRow>
            {isActiveFeeTooltip && (
              <ToolTipText>
                <Text size='12px' weight={500} color='grey600'>
                  <TextGroup inline>
                    <Text size='14px'>
                      <FormattedMessage
                        id='modals.simplebuy.paying_with_card'
                        defaultMessage='Blockchain.com requires a fee when paying with a card.'
                      />
                    </Text>
                    <Link
                      href='https://support.blockchain.com/hc/en-us/articles/360061672651'
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
      )}
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
                  id='modals.simplebuy.confirm.activity_accept_terms'
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

        <BottomActions>
          <Button
            fullwidth
            nature='primary'
            data-e2e='confirmSBOrder'
            size='16px'
            height='48px'
            type='submit'
            style={{ marginTop: '28px' }}
            disabled={props.submitting || !acceptTerms}
          >
            {props.submitting ? (
              <HeartbeatLoader height='16px' width='16px' color='white' />
            ) : (
              paymentPartnerButton
            )}
          </Button>

          <Button
            data-e2e='sbCancelCheckout'
            disabled={props.submitting}
            size='16px'
            height='48px'
            nature='light-red'
            onClick={handleCancel}
            style={{ marginTop: '16px' }}
          >
            <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
          </Button>
          {props.error && (
            <ErrorCartridge style={{ marginTop: '16px' }} data-e2e='checkoutError'>
              <Icon name='alert-filled' color='red600' style={{ marginRight: '4px' }} />
              Error: {props.error}
            </ErrorCartridge>
          )}
        </BottomActions>
      </Bottom>
    </CustomForm>
  )
}

type Props = OwnProps & SuccessStateType

export default reduxForm<{ form: string }, Props>({ form: 'sbCheckoutConfirm' })(Success)
