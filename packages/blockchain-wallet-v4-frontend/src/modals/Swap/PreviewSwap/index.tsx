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
import {
  coinToString,
  formatCoin
} from 'blockchain-wallet-v4/src/exchange/currency'
import { PaymentValue } from 'blockchain-wallet-v4/src/types'
import { ErrorCartridge } from 'components/Cartridge'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { actions, selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { RootState } from 'data/rootReducer'
import { InitSwapFormValuesType, SwapAmountFormValues } from 'data/types'

import { Props as BaseProps, SuccessStateType } from '..'
import { Border, FreeCartridge, TopText } from '../components'

class PreviewSwap extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  state = {}

  handleSubmit = e => {
    e.preventDefault()
    this.props.swapActions.createOrder()
  }

  networkFee = (value: PaymentValue | undefined) => {
    return value
      ? value.coin === 'BTC' || value.coin === 'BCH'
        ? value.selection?.fee
        : value.fee
      : 0
  }

  render() {
    if (
      !this.props.initSwapFormValues?.BASE ||
      !this.props.initSwapFormValues?.COUNTER
    ) {
      this.props.swapActions.setStep({ step: 'INIT_SWAP' })
      return null
    }

    const { BASE, COUNTER } = this.props.initSwapFormValues
    // @ts-ignore
    const { coins, swapActions } = this.props
    const baseCoinTicker = coins[BASE.coin].coinTicker
    const counterCoinTicker = coins[COUNTER.coin].coinTicker
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
              onClick={() =>
                swapActions.setStep({
                  step: 'ENTER_AMOUNT'
                })
              }
            />{' '}
            <Text
              size='20px'
              color='grey900'
              weight={600}
              style={{ marginLeft: '24px' }}
            >
              <FormattedMessage
                id='copy.confirm_swap'
                defaultMessage='Confirm Swap'
              />
            </Text>
          </TopText>
        </FlyoutWrapper>
        <Row>
          <Title>
            <FormattedMessage id='copy.swap' defaultMessage='Swap' />
          </Title>
          <Value data-e2e='swapOutgoingValue'>
            {coinToString({
              value: this.props.swapAmountFormValues?.cryptoAmount,
              unit: { symbol: baseCoinTicker }
            })}
          </Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage id='buttons.receive' defaultMessage='Receive' />
          </Title>
          <Value data-e2e='swapIncomingValue'>
            {this.props.incomingAmountR.cata({
              Success: value => (
                <>
                  {coinToString({
                    value: value.amt,
                    unit: { symbol: counterCoinTicker }
                  })}
                </>
              ),
              Failure: e => e,
              Loading: () => <SkeletonRectangle height='18px' width='70px' />,
              NotAsked: () => <SkeletonRectangle height='18px' width='70px' />
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
          <Value data-e2e='swapExchangeRate'>
            {this.props.quoteR.cata({
              Success: val => (
                <>
                  1 {baseCoinTicker} = {formatCoin(val.rate)}{' '}
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
              Loading: () => <SkeletonRectangle height='18px' width='70px' />,
              NotAsked: () => <SkeletonRectangle height='18px' width='70px' />
            })}
          </Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage id='copy.from' defaultMessage='From' />
          </Title>
          <Value data-e2e='swapOutgoingWallet'>{BASE.label}</Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage id='copy.to' defaultMessage='To' />
          </Title>
          <Value data-e2e='swapIncomingWallet'>{COUNTER.label}</Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage
              id='copy.coin_network_fee'
              defaultMessage='{coin} Network Fee'
              values={{ coin: coins[BASE.coin].coinTicker }}
            />
          </Title>
          <Value data-e2e='swapOutgoingFee'>
            {BASE.type === 'CUSTODIAL' ? (
              <FreeCartridge>
                <FormattedMessage id='copy.free' defaultMessage='FREE' />
              </FreeCartridge>
            ) : (
              this.props.paymentR.cata({
                Success: value => (
                  <>
                    {coinToString({
                      value: convertBaseToStandard(
                        BASE.baseCoin,
                        this.networkFee(value)
                      ),
                      unit: { symbol: coins[BASE.baseCoin].coinTicker }
                    })}
                  </>
                ),
                Failure: e => e,
                Loading: () => <SkeletonRectangle height='18px' width='70px' />,
                NotAsked: () => <SkeletonRectangle height='18px' width='70px' />
              })
            )}
          </Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage
              id='copy.coin_network_fee'
              defaultMessage='{coin} Network Fee'
              values={{ coin: counterCoinTicker }}
            />
          </Title>
          <Value data-e2e='swapIncomingFee'>
            {COUNTER.type === 'CUSTODIAL' ? (
              <FreeCartridge>
                <FormattedMessage id='copy.free' defaultMessage='FREE' />
              </FreeCartridge>
            ) : (
              this.props.quoteR.cata({
                Success: value => (
                  <>
                    {coinToString({
                      value: convertBaseToStandard(
                        COUNTER.coin,
                        value.quote.networkFee
                      ),
                      unit: {
                        symbol: coins[COUNTER.coin].coinTicker
                      }
                    })}
                  </>
                ),
                Failure: e => e,
                Loading: () => <SkeletonRectangle height='18px' width='70px' />,
                NotAsked: () => <SkeletonRectangle height='18px' width='70px' />
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
                <FormattedMessage
                  id='buttons.swap_x_for_y'
                  defaultMessage='Swap {base} for {counter}'
                  values={{ base: baseCoinTicker, counter: counterCoinTicker }}
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
              onClick={() => swapActions.setStep({ step: 'ENTER_AMOUNT' })}
            >
              <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
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
}

const mapStateToProps = (state: RootState) => ({
  initSwapFormValues: selectors.form.getFormValues('initSwap')(
    state
  ) as InitSwapFormValuesType,
  swapAmountFormValues: selectors.form.getFormValues('swapAmount')(
    state
  ) as SwapAmountFormValues,
  incomingAmountR: selectors.components.swap.getIncomingAmount(state),
  paymentR: selectors.components.swap.getPayment(state),
  quoteR: selectors.components.swap.getQuote(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  swapActions: bindActionCreators(actions.components.swap, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  reduxForm<{}, Props>({ form: 'previewSwap', destroyOnUnmount: false }),
  connector
)

type OwnProps = BaseProps & SuccessStateType & { handleClose: () => void }
export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(PreviewSwap) as React.ComponentClass<OwnProps>
