import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  Button,
  HeartbeatLoader,
  Icon,
  Link,
  SkeletonRectangle,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { Exchange } from 'blockchain-wallet-v4/src'
import { coinToString, formatFiat } from 'blockchain-wallet-v4/src/exchange/utils'
import {
  CoinType,
  PaymentValue,
  SBOrderActionType,
  SBPairType
} from 'blockchain-wallet-v4/src/types'
import { ErrorCartridge } from 'components/Cartridge'
import { FlyoutWrapper, Row, Value } from 'components/Flyout'
import { actions, selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { getFiatFromPair } from 'data/components/simpleBuy/model'
import { getInputFromPair, getOutputFromPair } from 'data/components/swap/model'
import { RootState } from 'data/rootReducer'
import { SBCheckoutFormValuesType, SwapAccountType, SwapBaseCounterTypes } from 'data/types'

import { Border, TopText } from '../../Swap/components'
import Loading from '../template.loading'

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  margin-left: 4px;
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
const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  padding-top: 30px;
  height: 100%;
`

const BottomActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: 1;
`

const DisclaimerText = styled(Text)`
  display: flex;
  font-size: 14px;
  font-weight: 500;
  flex-direction: row;
  margin-top: 24px;
  text-align: left;
  a {
    color: ${(props) => props.theme.blue600};
    cursor: pointer;
    text-decoration: none;
    display: contents;
  }
`

const getNetworkValue = (value: PaymentValue) =>
  value.coin === 'BTC' || value.coin === 'BCH' ? value.selection?.fee : value.fee

class PreviewSell extends PureComponent<
  InjectedFormProps<{ destroyOnUnmount: boolean; form: string }, Props> & Props,
  State
> {
  constructor(props) {
    super(props)
    this.state = { isSetCoinToolTip: false, isSetNetworkFee: false }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.simpleBuyActions.createSBOrder()
  }

  networkFee = (value: PaymentValue | undefined) => (value ? getNetworkValue(value) : 0)

  displayAmount = (formValues, account) => {
    return coinToString({
      unit: {
        symbol: account.coin
      },
      value: formValues?.cryptoAmount
    })
  }

  getFeeInFiat = (account: SwapAccountType, BASE, COUNTER) => {
    const { payment, rates, ratesEth } = this.props
    const isErc20 = window.coins[account.coin].coinfig.type.erc20Address
    return (
      (account.type === SwapBaseCounterTypes.ACCOUNT &&
        Number(
          Exchange.convertCoinToFiat({
            coin: BASE,
            currency: COUNTER,
            isStandard: true,
            rates: isErc20 ? ratesEth : rates,
            value: convertBaseToStandard(account.baseCoin, this.networkFee(payment))
          })
        )) ||
      0
    )
  }

  toggleCoinToolTip = () => {
    this.setState((prevState) => ({
      isSetCoinToolTip: !prevState.isSetCoinToolTip
    }))
  }

  toggleNetworkFeeToolTip = () => {
    this.setState((prevState) => ({
      isSetNetworkFee: !prevState.isSetNetworkFee
    }))
  }

  render() {
    return this.props.quoteR.cata({
      Failure: () => null,
      Loading: () => <Loading />,
      NotAsked: () => null,
      Success: (val) => {
        const { account, formValues } = this.props
        if (!formValues) return null
        if (!account) return null
        const BASE = getInputFromPair(val.quote.pair)
        const COUNTER = getOutputFromPair(val.quote.pair)
        const feeInFiat = this.getFeeInFiat(account, BASE, COUNTER)
        const counterCoinTicker = COUNTER
        const baseCoinTicker = BASE
        const { rates, ratesEth } = this.props
        const fiatCurrency = getFiatFromPair(this.props.pair.pair)
        const isErc20 = window.coins[COUNTER].coinfig.type.erc20Address

        return (
          <CustomForm onSubmit={this.handleSubmit}>
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
                      cryptoCurrency: BASE,
                      fiatCurrency: getFiatFromPair(this.props.pair.pair),
                      orderType: this.props.orderType,
                      pair: this.props.pair,
                      step: 'ENTER_AMOUNT',
                      swapAccount: this.props.account
                    })
                  }}
                />{' '}
                <Text size='20px' color='grey900' weight={600} style={{ marginLeft: '24px' }}>
                  <FormattedMessage
                    id='modals.simplebuy.checkoutconfirm'
                    defaultMessage='Checkout'
                  />
                </Text>
              </TopText>
              <Amount data-e2e='sbTotalAmount'>
                <div>
                  <Text size='32px' weight={600} color='grey800'>
                    {this.displayAmount(formValues, account)}
                  </Text>
                </div>
                <div>
                  <Text size='20px' weight={600} color='grey600' style={{ marginTop: '8px' }}>
                    {this.props.incomingAmountR.cata({
                      Failure: () => (
                        <Text size='14px' color='red600'>
                          <FormattedMessage
                            id='copy.oops'
                            defaultMessage='Oops. Something went wrong.'
                          />
                        </Text>
                      ),
                      Loading: () => <SkeletonRectangle height='18px' width='70px' />,
                      NotAsked: () => <SkeletonRectangle height='18px' width='70px' />,
                      Success: (success) => {
                        return (
                          <>
                            {counterCoinTicker}
                            {formatFiat(Number(success.amt) + Number(feeInFiat))}
                          </>
                        )
                      }
                    })}
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
                        values={{ coin: account.coin }}
                      />
                    </RowText>
                    <IconWrapper>
                      <Icon
                        name='question-in-circle-filled'
                        size='16px'
                        color={this.state.isSetCoinToolTip ? 'blue600' : 'grey300'}
                        onClick={() => this.toggleCoinToolTip()}
                      />
                    </IconWrapper>
                  </RowIcon>
                  <RowText data-e2e='sbExchangeRate'>
                    {this.props.quoteR.cata({
                      Failure: () => (
                        <Text size='14px' color='red600'>
                          <FormattedMessage
                            id='copy.oops'
                            defaultMessage='Oops. Something went wrong.'
                          />
                        </Text>
                      ),
                      Loading: () => <SkeletonRectangle height='18px' width='70px' />,
                      NotAsked: () => <SkeletonRectangle height='18px' width='70px' />,
                      Success: (success) => (
                        <>
                          {counterCoinTicker}
                          {formatFiat(convertBaseToStandard('FIAT', success.rate))}
                        </>
                      )
                    })}
                  </RowText>
                </TopRow>
                {this.state.isSetCoinToolTip && (
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
                          <FormattedMessage defaultMessage='Learn more' id='copy.learn_more' />
                        </Link>
                      </TextGroup>
                    </Text>
                  </ToolTipText>
                )}
              </RowItemContainer>
            </RowItem>
            <RowItem>
              <RowText>
                <FormattedMessage id='copy.deposit_to' defaultMessage='Deposit To' />
              </RowText>
              <Value data-e2e='sbIncomingAccount'>
                {counterCoinTicker} <FormattedMessage id='copy.account' defaultMessage='Account' />
              </Value>
            </RowItem>

            {account.type !== SwapBaseCounterTypes.CUSTODIAL && (
              <>
                <RowItem>
                  <RowText>
                    <FormattedMessage
                      id='modals.simplebuy.confirm.sale_amount'
                      defaultMessage='Sale Amount'
                    />
                  </RowText>
                  <RowText>
                    <RowTextWrapper>
                      {this.props.incomingAmountR.cata({
                        Failure: () => (
                          <Text size='14px' color='red600'>
                            <FormattedMessage
                              id='copy.oops'
                              defaultMessage='Oops. Something went wrong.'
                            />
                          </Text>
                        ),
                        Loading: () => <SkeletonRectangle height='18px' width='70px' />,
                        NotAsked: () => <SkeletonRectangle height='18px' width='70px' />,
                        Success: (success) => {
                          const saleAmount = formatFiat(Number(success.amt))
                          const saleInCoin = Exchange.convertFiatToCoin({
                            coin: BASE,
                            currency: fiatCurrency,
                            rates: window.coins[BASE].coinfig.type.erc20Address ? ratesEth : rates,
                            value: Number(saleAmount)
                          })
                          return (
                            <>
                              <Value data-e2e='sbSaleAccount'>
                                {counterCoinTicker}
                                {saleAmount}
                              </Value>
                              <AdditionalText>
                                {coinToString({
                                  unit: {
                                    symbol: account.baseCoin
                                  },
                                  value: saleInCoin
                                })}
                              </AdditionalText>
                            </>
                          )
                        }
                      })}
                    </RowTextWrapper>
                  </RowText>
                </RowItem>
                <RowItem>
                  <RowItemContainer>
                    <TopRow>
                      <RowIcon>
                        <RowText>
                          <FormattedMessage
                            id='copy.coin_network_fee'
                            defaultMessage='Network Fee'
                          />
                        </RowText>
                        <IconWrapper>
                          <Icon
                            name='question-in-circle-filled'
                            size='16px'
                            color={this.state.isSetNetworkFee ? 'blue600' : 'grey300'}
                            onClick={() => this.toggleNetworkFeeToolTip()}
                          />
                        </IconWrapper>
                      </RowIcon>
                      <RowText data-e2e='sbTransactionFee'>
                        <RowTextWrapper>
                          {counterCoinTicker}
                          {formatFiat(feeInFiat)}
                          <AdditionalText>
                            {coinToString({
                              unit: {
                                symbol: account.baseCoin
                              },
                              value: convertBaseToStandard(
                                account.baseCoin,
                                this.networkFee(this.props.payment)
                              )
                            })}
                          </AdditionalText>
                        </RowTextWrapper>
                      </RowText>
                    </TopRow>
                    {this.state.isSetNetworkFee && (
                      <ToolTipText>
                        <Text size='12px' weight={500} color='grey600'>
                          <TextGroup inline>
                            <Text size='14px'>
                              <FormattedMessage
                                id='modals.simplebuy.confirm.network_fees'
                                defaultMessage='Network fees are set by the {coin} network.'
                                values={{ coin: baseCoinTicker }}
                              />
                            </Text>
                            <Link
                              href={
                                isErc20
                                  ? 'https://support.blockchain.com/hc/en-us/articles/360061258732'
                                  : 'https://support.blockchain.com/hc/en-us/articles/360061672651'
                              }
                              size='14px'
                              rel='noopener noreferrer'
                              target='_blank'
                            >
                              <FormattedMessage
                                id='modals.simplebuy.confirm.learn_more_about_fees'
                                defaultMessage='Learn more about fees'
                              />
                            </Link>
                          </TextGroup>
                        </Text>
                      </ToolTipText>
                    )}
                  </RowItemContainer>
                </RowItem>
              </>
            )}
            <RowItem>
              <RowText>
                <FormattedMessage id='copy.total' defaultMessage='Total' />
              </RowText>

              <RowText>
                <RowTextWrapper>
                  <Value data-e2e='sbIncomingAmount'>
                    {this.props.incomingAmountR.cata({
                      Failure: () => (
                        <Text size='14px' color='red600'>
                          <FormattedMessage
                            id='copy.oops'
                            defaultMessage='Oops. Something went wrong.'
                          />
                        </Text>
                      ),
                      Loading: () => <SkeletonRectangle height='18px' width='70px' />,
                      NotAsked: () => <SkeletonRectangle height='18px' width='70px' />,
                      Success: (success) => {
                        return (
                          <>
                            {counterCoinTicker}
                            {formatFiat(Number(success.amt) + Number(feeInFiat))}
                          </>
                        )
                      }
                    })}
                  </Value>
                  <AdditionalText>{this.displayAmount(formValues, account)}</AdditionalText>
                </RowTextWrapper>
              </RowText>
            </RowItem>
            <Border />
            <FlyoutWrapper>
              <DisclaimerText>
                <FormattedMessage
                  id='modals.simplebuy.confirm.sell_description'
                  defaultMessage='Final amount may change due to market activity.{linebreak} By approving this Sell you agree to Blockchain.com’s {linebreak}<a>Refund Policy.</a>'
                  values={{
                    a: (msg: string) => (
                      <a
                        href='https://www.blockchain.com/legal/terms'
                        rel='noopener noreferrer'
                        target='_blank'
                      >
                        {msg}
                      </a>
                    ),
                    linebreak: <br />
                  }}
                />
              </DisclaimerText>
            </FlyoutWrapper>
            <Bottom>
              <BottomActions>
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
                          displayName: this.displayAmount(formValues, account)
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
                      cryptoCurrency: BASE,
                      fiatCurrency,
                      orderType: this.props.orderType,
                      pair: this.props.pair,
                      step: 'ENTER_AMOUNT',
                      swapAccount: this.props.account
                    })
                  }}
                >
                  <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
                </Button>
                <Text
                  size='12px'
                  weight={500}
                  color='grey600'
                  style={{ marginTop: '16px', textAlign: 'center' }}
                >
                  <FormattedMessage
                    id='copy.swap_amount_change_disclaimer'
                    defaultMessage='The amounts you send and receive may change slightly due to market activity. Once an order starts, we are unable to stop it.'
                  />
                </Text>
                {this.props.error && (
                  <ErrorCartridge style={{ marginTop: '16px' }} data-e2e='checkoutError'>
                    <Icon name='alert-filled' color='red600' style={{ marginRight: '4px' }} />
                    Error: {this.props.error}
                  </ErrorCartridge>
                )}
              </BottomActions>
            </Bottom>
          </CustomForm>
        )
      }
    })
  }
}

const mapStateToProps = (state: RootState) => {
  const coin = selectors.components.simpleBuy.getCryptoCurrency(state) as CoinType
  const payment = selectors.components.simpleBuy.getPayment(state).getOrElse(undefined)

  return {
    account: selectors.components.simpleBuy.getSwapAccount(state),
    coin,
    formValues: selectors.form.getFormValues('simpleBuyCheckout')(
      state
    ) as SBCheckoutFormValuesType,
    incomingAmountR: selectors.components.simpleBuy.getIncomingAmount(state),
    pair: selectors.components.simpleBuy.getSBPair(state),
    payment,
    quoteR: selectors.components.simpleBuy.getSellQuote(state),
    rates: selectors.core.data.misc.getRatesSelector(coin, state).getOrElse(0),
    ratesEth: selectors.core.data.misc.getRatesSelector('ETH', state).getOrElse(0)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  reduxForm<{ destroyOnUnmount: boolean; form: string }, Props>({
    destroyOnUnmount: false,
    form: 'previewSell'
  }),
  connector
)

type State = {
  isSetCoinToolTip: boolean
  isSetNetworkFee: boolean
}

type OwnProps = {
  handleClose: () => void
  orderType: SBOrderActionType
  pair: SBPairType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(PreviewSell) as React.ComponentClass<OwnProps>
