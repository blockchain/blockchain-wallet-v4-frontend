// Copied mostly from ../swap/PreviewSwap
import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

import { actions, selectors } from 'data'
import { Border, FreeCartridge, TopText } from '../../Swap/components'
import {
  Button,
  HeartbeatLoader,
  Icon,
  SkeletonRectangle,
  Text
} from 'blockchain-info-components'
import { BuyOrSell } from '../model'
import { coinToString, formatFiat } from 'core/exchange/currency'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { ErrorCartridge } from 'components/Cartridge'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { getFiatFromPair } from 'data/components/simpleBuy/model'
import { getInputFromPair, getOutputFromPair } from 'data/components/swap/model'
import {
  PaymentValue,
  SBOrderActionType,
  SBPairType,
  SupportedWalletCurrenciesType
} from 'core/types'
import { SBCheckoutFormValuesType } from 'data/types'

class PreviewSell extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  state = {}

  handleSubmit = e => {
    e.preventDefault()
    this.props.simpleBuyActions.createSBOrder()
  }

  getAmount = (amt: number | string | Array<number>) => {
    if (typeof amt === 'number') {
      return amt
    } else if (typeof amt === 'string') {
      return amt
    } else {
      return amt[0]
    }
  }
  networkFee = (value: PaymentValue | undefined) => {
    return value
      ? value.coin === 'BTC' || value.coin === 'BCH'
        ? value.selection?.fee
        : value.fee
      : 0
  }
  render () {
    return this.props.quoteR.cata({
      Failure: () => null,
      NotAsked: () => null,
      Loading: () => null,
      Success: val => {
        if (!this.props.formValues) return null
        if (!this.props.account) return null
        const BASE = getInputFromPair(val.quote.pair)
        const COUNTER = getOutputFromPair(val.quote.pair)
        const { account, coins } = this.props
        const baseCoinTicker = coins[BASE].coinTicker
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
                  <BuyOrSell
                    orderType={this.props.orderType}
                    crypto={account.coin}
                    coinModel={coins[account.coin]}
                  />
                </Text>
              </TopText>
            </FlyoutWrapper>
            <Row>
              <Title>
                <BuyOrSell
                  orderType={this.props.orderType}
                  crypto={account.coin}
                  coinModel={coins[account.coin]}
                />
              </Title>
              <Value>
                {this.props.paymentR.cata({
                  Success: value => (
                    <>
                      {coinToString({
                        value: convertBaseToStandard(
                          account.coin,
                          value && value.amount
                            ? this.getAmount(value.amount)
                            : 0
                        ),
                        unit: {
                          symbol: coins[account.coin].coinTicker
                        }
                      })}
                    </>
                  ),
                  Failure: e => e,
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
              <Title>
                <FormattedMessage
                  id='buttons.receive'
                  defaultMessage='Receive'
                />
              </Title>
              <Value>
                {this.props.incomingAmountR.cata({
                  Success: val => (
                    <>
                      {formatFiat(val.amt)} {counterCoinTicker}
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
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.confirm.rate'
                  defaultMessage='Exchange Rate'
                />
              </Title>
              <Value>
                {this.props.quoteR.cata({
                  Success: val => (
                    <>
                      1 {baseCoinTicker} ={' '}
                      {formatFiat(convertBaseToStandard('FIAT', val.rate))}{' '}
                      {counterCoinTicker}
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
              <Title>
                <FormattedMessage id='copy.from' defaultMessage='From' />
              </Title>
              <Value>{account.label}</Value>
            </Row>
            <Row>
              <Title>
                <FormattedMessage
                  id='copy.coin_network_fee'
                  defaultMessage='{coin} Network Fee'
                  values={{ coin: coins[BASE].coinTicker }}
                />
              </Title>
              <Value>
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
                  this.props.paymentR.cata({
                    Success: value => (
                      <>
                        {coinToString({
                          value: convertBaseToStandard(
                            account.baseCoin,
                            this.networkFee(value)
                          ),
                          unit: {
                            symbol: coins[account.baseCoin].coinTicker
                          }
                        })}
                      </>
                    ),
                    Failure: e => e,
                    Loading: () => (
                      <SkeletonRectangle height='18px' width='70px' />
                    ),
                    NotAsked: () => (
                      <SkeletonRectangle height='18px' width='70px' />
                    )
                  })
                )}
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
                    <BuyOrSell
                      orderType={this.props.orderType}
                      crypto={account.coin}
                      coinModel={coins[account.coin]}
                    />
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
                  // onClick={() => simpleBuyActions.setStep({ step: 'ENTER_AMOUNT' })}
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

const mapStateToProps = (state: RootState) => ({
  formValues: selectors.form.getFormValues('simpleBuyCheckout')(
    state
  ) as SBCheckoutFormValuesType,
  account: selectors.components.simpleBuy.getSwapAccount(state),
  coins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({} as SupportedWalletCurrenciesType),
  pair: selectors.components.simpleBuy.getSBPair(state),
  paymentR: selectors.components.simpleBuy.getPayment(state),
  incomingAmountR: selectors.components.simpleBuy.getIncomingAmount(state),
  quoteR: selectors.components.simpleBuy.getSellQuote(state)
})

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
