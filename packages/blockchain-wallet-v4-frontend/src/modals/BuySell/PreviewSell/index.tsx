import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { clearSubmitErrors, Form, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Exchange } from '@core'
import { coinToString, formatFiat } from '@core/exchange/utils'
import { BSOrderActionType, BSPairType, CoinType, PaymentValue, RatesType } from '@core/types'
import { Icon, Link, SkeletonRectangle, Text, TextGroup } from 'blockchain-info-components'
import { ErrorCartridge } from 'components/Cartridge'
import { FlyoutWrapper, Row, Value } from 'components/Flyout'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { actions, model, selectors } from 'data'
import { getFiatFromPair } from 'data/components/buySell/model'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { getInputFromPair, getOutputFromPair } from 'data/components/swap/model'
import { RootState } from 'data/rootReducer'
import {
  Analytics,
  BSCheckoutFormValuesType,
  SwapAccountType,
  SwapBaseCounterTypes
} from 'data/types'
import { isNabuError } from 'services/errors'

import { QuoteCountDown } from '../../components/QuoteCountDown'
import { COINS_WITH_CUSTOM_FEE, SOL_FEE, STX_FEE } from '../../constants'
import { Border, TopText } from '../../Swap/components'
import { ErrorCodeMappings } from '../model'
import Loading from '../template.loading'
import { SellButton } from './SellButton'

const { FORM_BS_CHECKOUT, FORM_BS_PREVIEW_SELL } = model.components.buySell

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const RowItem = styled(Row)`
  display: flex;
  justify-content: space-between;
`
const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
`

const RowIcon = styled.div`
  display: flex;
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

const QuoteCountDownWrapper = styled.div`
  margin-top: 28px;
`

const Amount = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
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
  value.coin === COINS_WITH_CUSTOM_FEE.BTC || value.coin === COINS_WITH_CUSTOM_FEE.BCH
    ? value.selection?.fee
    : value.fee

class PreviewSell extends PureComponent<
  InjectedFormProps<{ destroyOnUnmount: boolean; form: string }, Props> & Props,
  State
> {
  constructor(props) {
    super(props)
    this.state = { isSetCoinToolTip: false, isSetNetworkFee: false }
  }

  componentDidMount() {
    this.props.analyticsActions.trackEvent({
      key: Analytics.SELL_CHECKOUT_VIEWED,
      properties: {}
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.analyticsActions.trackEvent({
      key: Analytics.SELL_CHECKOUT_SCREEN_SUBMITTED,
      properties: {}
    })

    this.props.buySellActions.createSellOrder()
  }

  handleOnClickBack = (BASE: string) => {
    this.props.analyticsActions.trackEvent({
      key: Analytics.SELL_CHECKOUT_SCREEN_BACK_CLICKED,
      properties: {}
    })

    this.props.buySellActions.setStep({
      cryptoCurrency: BASE,
      fiatCurrency: getFiatFromPair(this.props.pair.pair),
      orderType: this.props.orderType,
      pair: this.props.pair,
      step: 'SELL_ENTER_AMOUNT',
      swapAccount: this.props.account
    })
  }

  networkFee = (value: PaymentValue | undefined, account: SwapAccountType | undefined) => {
    if (account?.type === SwapBaseCounterTypes.ACCOUNT) {
      if (account?.coin === COINS_WITH_CUSTOM_FEE.STX) {
        return STX_FEE
      }

      if (account?.coin === COINS_WITH_CUSTOM_FEE.SOL) {
        return SOL_FEE
      }
    }
    return value ? getNetworkValue(value) : 0
  }

  displayAmount = (formValues, account) => {
    return coinToString({
      unit: {
        symbol: account.coin
      },
      value: formValues?.cryptoAmount
    })
  }

  displayTotalAmount = (formValues, account, payment) => {
    return coinToString({
      unit: {
        symbol: account.coin
      },
      value: new BigNumber(formValues?.cryptoAmount).plus(
        new BigNumber(
          convertBaseToStandard(account.baseCoin, this.networkFee(payment, account))
        ).toString()
      )
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
            value: convertBaseToStandard(account.baseCoin, this.networkFee(payment, account))
          })
        )) ||
      0
    )
  }

  toggleCoinToolTip = () => {
    this.props.analyticsActions.trackEvent({
      key: Analytics.SELL_PRICE_TOOLTIP_CLICKED,
      properties: {}
    })

    this.setState((prevState) => ({
      isSetCoinToolTip: !prevState.isSetCoinToolTip
    }))
  }

  toggleNetworkFeeToolTip = () => {
    this.props.analyticsActions.trackEvent({
      key: Analytics.SELL_CHECKOUT_NETWORK_FEES_CLICKED,
      properties: {}
    })

    this.setState((prevState) => ({
      isSetNetworkFee: !prevState.isSetNetworkFee
    }))
  }

  render() {
    const { error } = this.props

    if (isNabuError(error)) {
      return <GenericNabuErrorFlyout error={error} onDismiss={this.props.clearErrors} />
    }

    return this.props.quoteR.cata({
      Failure: () => null,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => {
        const { account, formValues, payment } = this.props
        if (!formValues) return null
        if (!account) return null
        const BASE = getInputFromPair(this.props.pair.pair)
        const COUNTER = getOutputFromPair(this.props.pair.pair)
        const feeInFiat = this.getFeeInFiat(account, BASE, COUNTER)
        const counterCoinTicker = COUNTER
        const baseCoinTicker = BASE
        const isErc20 = window.coins[COUNTER].coinfig.type.erc20Address
        const incomingCoinName = window.coins[counterCoinTicker]?.coinfig.name ?? counterCoinTicker

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
                  onClick={() => this.handleOnClickBack(BASE)}
                />{' '}
                <Text size='20px' color='grey900' weight={600} style={{ marginLeft: '24px' }}>
                  <FormattedMessage
                    id='modals.simplebuy.checkoutconfirm'
                    defaultMessage='Checkout'
                  />
                </Text>
              </TopText>
              <QuoteCountDownWrapper>
                <QuoteCountDown date={val.refreshConfig.date} totalMs={val.refreshConfig.totalMs} />
              </QuoteCountDownWrapper>
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
                            &nbsp;
                            {formatFiat(
                              convertBaseToStandard('FIAT', new BigNumber(success.amt).toString())
                            )}
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
              <Value data-e2e='sbIncomingAccount'>{incomingCoinName}</Value>
            </RowItem>

            {account.type !== SwapBaseCounterTypes.CUSTODIAL && (
              <>
                <RowItem>
                  <RowItemContainer>
                    <TopRow>
                      <RowIcon>
                        <RowText>
                          <FormattedMessage id='copy.network_fee' defaultMessage='Network Fee' />
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
                                this.networkFee(payment, account)
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
                            &nbsp;
                            {formatFiat(
                              new BigNumber(
                                convertBaseToStandard('FIAT', new BigNumber(success.amt).toString())
                              )
                                .plus(new BigNumber(feeInFiat).toString())
                                .toString()
                            )}
                          </>
                        )
                      }
                    })}
                  </Value>
                  <AdditionalText>
                    {this.displayTotalAmount(formValues, account, payment)}
                  </AdditionalText>
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
                <SellButton
                  isSubmitting={this.props.submitting}
                  refreshConfig={val.refreshConfig}
                />
                <Text
                  size='12px'
                  weight={500}
                  color='grey600'
                  style={{ marginTop: '16px', textAlign: 'center' }}
                >
                  <FormattedMessage
                    id='copy.buy_amount_change_disclaimer'
                    defaultMessage='The amounts you send and receive may change slightly due to market activity. Once an order starts, we are unable to stop it.'
                  />
                </Text>
                {this.props.error && (
                  <ErrorCartridge style={{ marginTop: '16px' }} data-e2e='checkoutError'>
                    <Icon name='alert-filled' color='red600' style={{ marginRight: '4px' }} />
                    {Number(this.props.error) ? (
                      <ErrorCodeMappings code={this.props.error} />
                    ) : (
                      `Error: ${this.props.error}`
                    )}
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
  const coin = selectors.components.buySell.getCryptoCurrency(state) as CoinType
  const payment = selectors.components.buySell.getPayment(state).getOrElse(undefined)

  return {
    account: selectors.components.buySell.getSwapAccount(state),
    coin,
    formValues: selectors.form.getFormValues(FORM_BS_CHECKOUT)(state) as BSCheckoutFormValuesType,
    incomingAmountR: selectors.components.buySell.getIncomingAmount(state),
    pair: selectors.components.buySell.getBSPair(state),
    payment,
    quoteR: selectors.components.buySell.getSellQuote(state),
    rates: selectors.core.data.misc.getRatesSelector(coin, state).getOrElse({} as RatesType),
    ratesEth: selectors.core.data.misc.getRatesSelector('ETH', state).getOrElse({} as RatesType)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  clearErrors: () => dispatch(clearSubmitErrors(FORM_BS_PREVIEW_SELL))
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  reduxForm<{ destroyOnUnmount: boolean; form: string }, Props>({
    destroyOnUnmount: false,
    form: FORM_BS_PREVIEW_SELL
  }),
  connector
)

type State = {
  isSetCoinToolTip: boolean
  isSetNetworkFee: boolean
}

type OwnProps = {
  handleClose: () => void
  orderType: BSOrderActionType
  pair: BSPairType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(PreviewSell) as React.ComponentClass<OwnProps>
