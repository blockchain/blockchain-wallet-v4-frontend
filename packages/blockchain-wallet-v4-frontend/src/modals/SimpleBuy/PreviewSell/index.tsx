import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'

import {
  Button,
  HeartbeatLoader,
  Icon,
  SkeletonRectangle,
  Text
} from 'blockchain-info-components'
import { Exchange } from 'blockchain-wallet-v4/src'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import {
  coinToString,
  formatFiat
} from 'blockchain-wallet-v4/src/exchange/currency'
import {
  CoinType,
  Erc20CoinsEnum,
  PaymentValue,
  RatesType,
  SBOrderActionType,
  SBPairType,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import { ErrorCartridge } from 'components/Cartridge'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { actions, selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { getFiatFromPair } from 'data/components/simpleBuy/model'
import { getInputFromPair, getOutputFromPair } from 'data/components/swap/model'
import { RootState } from 'data/rootReducer'
import { SBCheckoutFormValuesType } from 'data/types'

import { Border, FreeCartridge, TopText } from '../../Swap/components'
import Loading from '../template.loading'

class PreviewSell extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  state = {}

  handleSubmit = e => {
    e.preventDefault()
    this.props.simpleBuyActions.createSBOrder()
  }

  networkFee = (value: PaymentValue | undefined) => {
    return value
      ? value.coin === 'BTC' || value.coin === 'BCH'
        ? value.selection?.fee
        : value.fee
      : 0
  }

  displayAmount = (formValues, coins, account) => {
    return coinToString({
      value: formValues?.cryptoAmount,
      unit: {
        symbol: coins[account.coin].coinTicker
      }
    })
  }

  getFeeInFiat = (account, BASE, COUNTER) => {
    const { payment, rates, ratesEth } = this.props
    return (
      (account.type === 'ACCOUNT' &&
        (Exchange.convertCoinToFiat(
          convertBaseToStandard(account.baseCoin, this.networkFee(payment)),
          BASE,
          COUNTER,
          BASE in Erc20CoinsEnum ? ratesEth : rates
        ) as Number)) ||
      0
    )
  }

  render() {
    return this.props.quoteR.cata({
      Failure: () => null,
      NotAsked: () => null,
      Loading: () => <Loading />,
      Success: val => {
        const { account, coins, formValues } = this.props
        if (!formValues) return null
        if (!account) return null
        const BASE = getInputFromPair(val.quote.pair)
        const COUNTER = getOutputFromPair(val.quote.pair)
        const feeInFiat = this.getFeeInFiat(account, BASE, COUNTER)
        const counterCoinTicker = coins[COUNTER].coinTicker
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
                  onClick={() => {
                    this.props.simpleBuyActions.setStep({
                      step: 'ENTER_AMOUNT',
                      pair: this.props.pair,
                      cryptoCurrency: BASE,
                      fiatCurrency: getFiatFromPair(this.props.pair.pair),
                      orderType: this.props.orderType,
                      swapAccount: this.props.account
                    })
                  }}
                />{' '}
                <Text
                  size='20px'
                  color='grey900'
                  weight={600}
                  style={{ marginLeft: '24px' }}
                >
                  <FormattedMessage
                    id='modals.simplebuy.checkoutconfirm'
                    defaultMessage='Checkout'
                  />
                </Text>
              </TopText>
              <Text
                size='32px'
                color='grey900'
                weight={600}
                style={{ margin: '40px 0 0 5px' }}
                data-e2e='sbTotalAmount'
              >
                {this.displayAmount(formValues, coins, account)}
              </Text>
            </FlyoutWrapper>
            <Row>
              <Title color='grey600'>
                <FormattedMessage
                  id='modals.simplebuy.confirm.coin_price'
                  defaultMessage='{coin} Price'
                  values={{ coin: coins[account.coin].coinTicker }}
                />
              </Title>
              <Value data-e2e='sbExchangeRate'>
                {this.props.quoteR.cata({
                  Success: val => (
                    <>
                      {
                        Currencies[counterCoinTicker].units[counterCoinTicker]
                          .symbol
                      }
                      {formatFiat(convertBaseToStandard('FIAT', val.rate))}
                    </>
                  ),
                  Failure: () => (
                    <Text size='14px' color='red600'>
                      <FormattedMessage
                        id='copy.oops'
                        defaultMessage='Oops. Something went wrong.'
                      />
                    </Text>
                  ),
                  Loading: () => (
                    <SkeletonRectangle height='18px' width='70px' />
                  ),
                  NotAsked: () => (
                    <SkeletonRectangle height='18px' width='70px' />
                  )
                })}
              </Value>
            </Row>
            <Row>
              <Title color='grey600'>
                <FormattedMessage id='copy.from' defaultMessage='From' />
              </Title>
              <Value data-e2e='sbOutgoingAccount'>{account.label}</Value>
            </Row>
            <Row>
              <Title color='grey600'>
                <FormattedMessage id='copy.to' defaultMessage='To' />
              </Title>
              <Value data-e2e='sbIncomingAccount'>
                {counterCoinTicker} Wallet
              </Value>
            </Row>
            <Row>
              <Title color='grey600'>
                <FormattedMessage
                  id='copy.coin_network_fee'
                  defaultMessage='Network Fee'
                />
              </Title>
              <Value data-e2e='sbTransactionFee'>
                {account.type === 'CUSTODIAL' ? (
                  <>
                    <>0 {account.baseCoin}</>
                    <div>
                      <FreeCartridge>
                        <FormattedMessage
                          id='copy.free'
                          defaultMessage='FREE'
                        />
                      </FreeCartridge>
                    </div>
                  </>
                ) : (
                  <>
                    {coinToString({
                      value: convertBaseToStandard(
                        account.baseCoin,
                        this.networkFee(this.props.payment)
                      ),
                      unit: {
                        symbol: coins[account.baseCoin].coinTicker
                      }
                    })}
                  </>
                )}
              </Value>
            </Row>
            <Row>
              <Title color='grey600'>
                <FormattedMessage id='copy.total' defaultMessage='Total' />
              </Title>
              <Value data-e2e='sbIncomingAmount'>
                {this.props.incomingAmountR.cata({
                  Success: val => {
                    return (
                      <>
                        {
                          Currencies[counterCoinTicker].units[counterCoinTicker]
                            .symbol
                        }
                        {formatFiat(Number(val.amt) + Number(feeInFiat))}
                      </>
                    )
                  },
                  Failure: () => (
                    <Text size='14px' color='red600'>
                      <FormattedMessage
                        id='copy.oops'
                        defaultMessage='Oops. Something went wrong.'
                      />
                    </Text>
                  ),
                  Loading: () => (
                    <SkeletonRectangle height='18px' width='70px' />
                  ),
                  NotAsked: () => (
                    <SkeletonRectangle height='18px' width='70px' />
                  )
                })}{' '}
              </Value>
            </Row>
            <Border />
            <FlyoutWrapper>
              <Form onSubmit={this.handleSubmit}>
                <Button
                  nature='primary'
                  data-e2e='swapBtn'
                  type='submit'
                  disabled={this.props.submitting}
                  fullwidth
                  height='48px'
                >
                  {this.props.submitting ? (
                    <HeartbeatLoader height='16px' width='16px' color='white' />
                  ) : (
                    <Text weight={600} color='white'>
                      <FormattedMessage
                        id='buttons.sell_coin'
                        defaultMessage='Sell {displayName}'
                        values={{
                          displayName: this.displayAmount(
                            formValues,
                            coins,
                            account
                          )
                        }}
                      />
                    </Text>
                  )}
                </Button>
                <Button
                  nature='light-red'
                  data-e2e='swapCancelBtn'
                  type='button'
                  disabled={this.props.submitting}
                  fullwidth
                  height='48px'
                  color='red400'
                  style={{ marginTop: '16px' }}
                  onClick={() => {
                    this.props.simpleBuyActions.setStep({
                      step: 'ENTER_AMOUNT',
                      pair: this.props.pair,
                      cryptoCurrency: BASE,
                      fiatCurrency: getFiatFromPair(this.props.pair.pair),
                      orderType: this.props.orderType,
                      swapAccount: this.props.account
                    })
                  }}
                >
                  <FormattedMessage
                    id='buttons.cancel'
                    defaultMessage='Cancel'
                  />
                </Button>
                <Text
                  size='12px'
                  weight={500}
                  color='grey600'
                  style={{ textAlign: 'center', marginTop: '16px' }}
                >
                  <FormattedMessage
                    id='copy.swap_amount_change_disclaimer'
                    defaultMessage='The amounts you send and receive may change slightly due to market activity. Once an order starts, we are unable to stop it.'
                  />
                </Text>
                {this.props.error && (
                  <ErrorCartridge
                    style={{ marginTop: '16px' }}
                    data-e2e='checkoutError'
                  >
                    <Icon
                      name='alert-filled'
                      color='red600'
                      style={{ marginRight: '4px' }}
                    />
                    Error: {this.props.error}
                  </ErrorCartridge>
                )}
              </Form>
            </FlyoutWrapper>
          </>
        )
      }
    })
  }
}

const mapStateToProps = (state: RootState) => {
  const coin = selectors.components.simpleBuy.getCryptoCurrency(
    state
  ) as CoinType
  const payment = selectors.components.simpleBuy
    .getPayment(state)
    .getOrElse(undefined)

  return {
    account: selectors.components.simpleBuy.getSwapAccount(state),
    coin,
    coins: selectors.core.walletOptions
      .getSupportedCoins(state)
      .getOrElse({} as SupportedWalletCurrenciesType),
    formValues: selectors.form.getFormValues('simpleBuyCheckout')(
      state
    ) as SBCheckoutFormValuesType,
    pair: selectors.components.simpleBuy.getSBPair(state),
    payment,
    incomingAmountR: selectors.components.simpleBuy.getIncomingAmount(state),
    quoteR: selectors.components.simpleBuy.getSellQuote(state),
    rates: selectors.core.data.misc
      .getRatesSelector(coin, state)
      .getOrElse({} as RatesType),
    ratesEth: selectors.core.data.misc
      .getRatesSelector('ETH', state)
      .getOrElse({} as RatesType)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  reduxForm<{}, Props>({ form: 'previewSell', destroyOnUnmount: false }),
  connector
)

type OwnProps = {
  handleClose: () => void
  orderType: SBOrderActionType
  pair: SBPairType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(PreviewSell) as React.ComponentClass<OwnProps>
