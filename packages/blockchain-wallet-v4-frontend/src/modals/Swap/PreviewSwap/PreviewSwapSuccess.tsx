import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Form } from 'redux-form'

import { formatCoin } from '@core/exchange/utils'
import Remote from '@core/remote'
import { PaymentValue, SwapNewQuoteStateType } from '@core/types'
import { Icon, Link, Text, TextGroup } from 'blockchain-info-components'
import { ErrorCartridge } from 'components/Cartridge'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { IncomingAmount, InitSwapFormValuesType, SwapAmountFormValues } from 'data/types'
import { isNabuError } from 'services/errors'

import { QuoteCountDown } from '../../components/QuoteCountDown'
import { FeeBreakdownBox, FromToLogoLeft, TopText } from '../components'
import { PreviewSwapButton } from './PreviewSwapButton'
import {
  ExchangeRateRow,
  IconWrapper,
  QuoteCountDownWrapper,
  StyledRow,
  ToolTipText
} from './PreviewSwapSuccess.styles'

type Props = {
  clearErrors: () => void
  createOrder: () => void
  error?: any
  incomingAmount: IncomingAmount
  initSwapFormValues: InitSwapFormValuesType
  onClickBack: () => void
  payment: PaymentValue | undefined
  quote: SwapNewQuoteStateType
  returnToInitSwap: () => void
  submitting: boolean
  swapAmountFormValues: SwapAmountFormValues
  trackExchangeTooltip: () => void
}

export const PreviewSwapSuccess = (props: Props) => {
  const [isActiveExchangeToolTip, setIsActiveExchangeToolTip] = useState(false)

  const clearSubmitErrors = () => {
    props.clearErrors()
  }

  useEffect(() => {
    return () => {
      clearSubmitErrors()
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    props.createOrder()
  }

  const toggleExchangeTooltip = () => {
    setIsActiveExchangeToolTip((prevState) => !prevState)

    props.trackExchangeTooltip()
  }

  if (!props.initSwapFormValues?.BASE || !props.initSwapFormValues?.COUNTER) {
    props.returnToInitSwap()
    return null
  }

  const { BASE, COUNTER } = props.initSwapFormValues

  const { error } = props
  const baseCoinDisplaySymbol = window.coins[BASE.coin].coinfig.displaySymbol
  const counterCoinDisplaySymbol = window.coins[COUNTER.coin].coinfig.displaySymbol

  if (isNabuError(error)) {
    return <GenericNabuErrorFlyout error={error} onDismiss={clearSubmitErrors} />
  }

  return (
    <>
      <FlyoutWrapper>
        <TopText spaceBetween={false} marginBottom>
          <Icon
            role='button'
            data-e2e='backToEnterAmount'
            name='arrow-back'
            cursor
            size='24px'
            color='grey600'
            onClick={props.onClickBack}
          />{' '}
          <Text size='20px' color='grey900' weight={600} style={{ marginLeft: '24px' }}>
            <FormattedMessage id='copy.confirm_swap' defaultMessage='Confirm Swap' />
          </Text>
        </TopText>
        <QuoteCountDownWrapper>
          <QuoteCountDown
            date={props.quote.refreshConfig.date}
            totalMs={props.quote.refreshConfig.totalMs}
          />
        </QuoteCountDownWrapper>
      </FlyoutWrapper>

      <FromToLogoLeft
        accountType={BASE.type}
        amount={props.swapAmountFormValues?.cryptoAmount}
        base
        coinCode={BASE.coin}
        label={BASE.label}
      >
        <FormattedMessage id='copy.from' defaultMessage='From' />
      </FromToLogoLeft>

      <FromToLogoLeft
        accountType={COUNTER.type}
        amount={props.incomingAmount.amt}
        base={false}
        coinCode={COUNTER.coin}
        label={COUNTER.label}
      >
        <FormattedMessage id='copy.to' defaultMessage='To' />
      </FromToLogoLeft>

      <StyledRow>
        <div>
          <Title>
            <ExchangeRateRow>
              <Text color='grey900' weight={500}>
                <FormattedMessage
                  id='modals.simplebuy.confirm.rate'
                  defaultMessage='Exchange Rate'
                />
              </Text>
              <IconWrapper>
                <Icon
                  name='question-in-circle-filled'
                  size='16px'
                  color={isActiveExchangeToolTip ? 'blue600' : 'grey300'}
                  onClick={toggleExchangeTooltip}
                />
              </IconWrapper>
            </ExchangeRateRow>
          </Title>
          <Value data-e2e='swapExchangeRate' style={{ marginTop: 0 }}>
            <Text weight={400} color='grey900'>
              1 {baseCoinDisplaySymbol} = {formatCoin(props.quote.price)} {counterCoinDisplaySymbol}
            </Text>
          </Value>
        </div>
        {isActiveExchangeToolTip && (
          <ToolTipText>
            <Text size='12px'>
              <TextGroup inline>
                <FormattedMessage
                  id='copy.swap_exchange_rate_tt_1'
                  defaultMessage='The exchange rate is the best price available for'
                />{' '}
                {counterCoinDisplaySymbol}{' '}
                <FormattedMessage
                  id='copy.swap_exchange_rate_tt_2'
                  defaultMessage='in terms of 1'
                />{' '}
                {baseCoinDisplaySymbol}{' '}
                <Link
                  href='https://support.blockchain.com/hc/en-us/articles/360061672651'
                  size='12px'
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
      </StyledRow>
      <Row style={{ borderTop: '0' }}>
        <FeeBreakdownBox
          counter={COUNTER}
          counterQuote={Remote.Success(props.quote)}
          base={BASE}
          basePayment={Remote.Success(props.payment)}
        />
        <TextGroup inline style={{ marginTop: '16px', textAlign: 'center' }}>
          <Text size='12px' weight={500} color='grey600'>
            <FormattedMessage
              id='copy.swap_amount_change_disclaimer'
              defaultMessage='Final amount may change due to market activity. By approving this Swap you agree to Blockchain.com’s'
            />
          </Text>
          <Text size='12px' weight={500} color='grey600'>
            <Link
              href='https://support.blockchain.com/hc/en-us/articles/4417063009172'
              size='12px'
              rel='noopener noreferrer'
              target='_blank'
            >
              <FormattedMessage id='copy.refund_policy' defaultMessage='Refund Policy' />.
            </Link>
          </Text>
        </TextGroup>
      </Row>
      <FlyoutWrapper>
        <Form onSubmit={handleSubmit}>
          <PreviewSwapButton
            isSubmitting={props.submitting}
            refreshConfig={props.quote.refreshConfig}
          />
          {props.error && (
            <ErrorCartridge style={{ marginTop: '16px' }} data-e2e='checkoutError'>
              <Icon name='alert-filled' color='red600' style={{ marginRight: '4px' }} />
              Error: {props.error}
            </ErrorCartridge>
          )}
        </Form>
      </FlyoutWrapper>
    </>
  )
}
