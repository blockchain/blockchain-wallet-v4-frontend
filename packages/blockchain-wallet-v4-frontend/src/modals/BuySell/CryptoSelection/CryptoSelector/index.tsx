import React from 'react'
import { FormattedMessage } from 'react-intl'
import { equals } from 'ramda'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { BSOrderActionType, BSPairType, FiatType, OrderType } from '@core/types'
import { Icon, Image, TabMenu, TabMenuItem, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { model } from 'data'
import { getCoinFromPair, getFiatFromPair } from 'data/components/buySell/model'
import { Analytics, ModalName, SwapAccountType } from 'data/types'

import { Props as OwnProps, SuccessStateType } from '../index'
import CryptoItem from './CryptoItem'
import SellState from './SellState'

const { FORM_BS_CRYPTO_SELECTION } = model.components.buySell

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`
const CloseContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`
const TabsContainer = styled.div`
  margin-top: 36px;
  display: inline-block;
`
const Currencies = styled.div`
  border-top: 1px solid ${(props) => props.theme.grey000};
`
const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`
const SubTitleText = styled(Text)`
  margin-top: 0;
`
const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;

  span {
    margin-left: 8px;
  }
`

export type Props = OwnProps & SuccessStateType
type State = { orderType: BSOrderActionType }

class CryptoSelector extends React.Component<InjectedFormProps<{}, Props> & Props, State> {
  constructor(props) {
    super(props)
    this.state = { orderType: this.props.orderType }
  }

  componentDidMount() {
    this.trackScreenViewed()
  }

  shouldComponentUpdate = (nextProps, nextState) =>
    !equals(this.props, nextProps) || !equals(this.state, nextState)

  componentDidUpdate(
    prevProps: Readonly<InjectedFormProps<{}, Props> & Props>,
    prevState: Readonly<State>
  ) {
    if (prevState.orderType !== this.state.orderType) {
      this.trackScreenViewed()
    }
  }

  setOrderType = (orderType: OrderType) => {
    if (orderType === OrderType.SELL) {
      const userCurrentTier = this.props.userData?.tiers?.current ?? 0

      // non T2 users can't sell
      if (userCurrentTier !== 2) {
        this.props.modalsActions.showModal(ModalName.UPGRADE_NOW_SILVER_MODAL, {
          origin: 'BSEnterAmountCheckout'
        })
        return
      }
    }

    this.setState({ orderType })
  }

  handleBuy = (pair: BSPairType) => {
    this.props.analyticsActions.trackEvent({
      key: Analytics.BUY_ASSET_SELECTED,
      properties: {}
    })

    // in case of not directly supported fiat currency lend user to select trading currency from list
    const { preferredFiatTradingCurrency } = this.props.userData.currencies
    const fiatCurrency =
      this.props.originalFiatCurrency && preferredFiatTradingCurrency
        ? preferredFiatTradingCurrency
        : getFiatFromPair(pair.pair)

    // default continue to enter amount step
    return this.props.buySellActions.setStep({
      cryptoCurrency: getCoinFromPair(pair.pair),
      fiatCurrency: fiatCurrency as FiatType,
      orderType: this.state.orderType,
      pair,
      step: 'ENTER_AMOUNT'
    })
  }

  handleSell = (swapAccount: SwapAccountType) => {
    const pair = this.props.pairs.find((value) => getCoinFromPair(value.pair) === swapAccount.coin)
    if (!pair) return

    this.props.analyticsActions.trackEvent({
      key: Analytics.SELL_ASSET_SELECTED,
      properties: {}
    })

    this.props.buySellActions.proceedToSellEnterAmount({ account: swapAccount, pair })
  }

  trackScreenViewed = () => {
    this.props.analyticsActions.trackEvent({
      key:
        this.state.orderType === 'BUY'
          ? Analytics.BUY_ASSET_SCREEN_VIEWED
          : Analytics.SELL_ASSET_SCREEN_VIEWED,
      properties: {}
    })
  }

  render() {
    const showWelcome = this.props.isFirstLogin

    return (
      <Wrapper>
        <Form
          onSubmit={() => {
            // do nothing
          }}
        >
          <FlyoutWrapper>
            <CloseContainer>
              <Icon
                cursor
                data-e2e='sbCloseModalIcon'
                name='close'
                size='20px'
                color='grey600'
                role='button'
                onClick={this.props.handleClose}
              />
            </CloseContainer>
            {showWelcome && (
              <Header>
                <Image name='intro-hand' width='28px' height='28px' />
                <Text color='grey600' size='20px' weight={600}>
                  <FormattedMessage
                    id='modals.wallet.tour.wallet.tour'
                    defaultMessage='Welcome to Blockchain!'
                  />
                </Text>
              </Header>
            )}
            <Top>
              {!showWelcome && <Icon cursor name='cart-filled' size='32px' color='blue600' />}
            </Top>
            {!showWelcome && (
              <>
                <TopText color='grey800' size='20px' weight={600}>
                  <FormattedMessage
                    id='modals.simplebuy.cryptoselect'
                    defaultMessage='Buy Crypto. Sell for Cash.'
                  />
                </TopText>
                <SubTitleText color='grey600' weight={500}>
                  <FormattedMessage
                    id='modals.simplebuy.select_crypto'
                    defaultMessage='Easily buy and sell Crypto straight from your Wallet.'
                  />
                </SubTitleText>
              </>
            )}

            {showWelcome && (
              <>
                <TopText color='grey800' size='20px' weight={600}>
                  <FormattedMessage
                    id='modals.simplebuy.buy_crypto_now'
                    defaultMessage='Buy Crypto Now'
                  />
                </TopText>
                <SubTitleText color='grey600' weight={500}>
                  <FormattedMessage
                    id='modals.simplebuy.select_and_verify'
                    defaultMessage='Select the crypto you want to buy, verify your identity and buy crypto.'
                  />
                </SubTitleText>
              </>
            )}

            {!showWelcome && (
              <TabsContainer>
                <TabMenu>
                  <TabMenuItem
                    role='button'
                    selected={this.state.orderType === OrderType.BUY}
                    onClick={() => {
                      this.setOrderType(OrderType.BUY)
                      // tracking event
                      this.props.buySellActions.setBuyCrypto('CurrencyList')
                    }}
                    data-e2e='sbBuyButton'
                  >
                    <FormattedMessage id='buttons.buy_crypto' defaultMessage='Buy Crypto' />
                  </TabMenuItem>
                  <TabMenuItem
                    role='button'
                    selected={this.state.orderType === OrderType.SELL}
                    onClick={() => {
                      this.setOrderType(OrderType.SELL)
                      // tracking event
                      this.props.buySellActions.setSellCrypto('CurrencyList')
                    }}
                    data-e2e='sbSellButton'
                  >
                    <FormattedMessage id='buttons.sell_crypto' defaultMessage='Sell Crypto' />
                  </TabMenuItem>
                </TabMenu>
              </TabsContainer>
            )}
          </FlyoutWrapper>
          <Currencies>
            {this.state.orderType === OrderType.SELL ? (
              <SellState handleSell={this.handleSell} handleClose={this.props.handleClose} />
            ) : (
              this.props.pairs.map((value) => (
                <CryptoItem
                  key={`${getFiatFromPair(value.pair)}-${getCoinFromPair(value.pair)}`}
                  orderType={this.state.orderType}
                  fiat={getFiatFromPair(value.pair)}
                  coin={getCoinFromPair(value.pair)}
                  onClick={() => this.handleBuy(value as BSPairType)}
                />
              ))
            )}
          </Currencies>
        </Form>
      </Wrapper>
    )
  }
}

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: FORM_BS_CRYPTO_SELECTION
})(CryptoSelector)
