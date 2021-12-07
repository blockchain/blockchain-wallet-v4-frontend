import React from 'react'
import { FormattedMessage } from 'react-intl'
import { any, equals, map, values } from 'ramda'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { BSOrderActionType, BSPairType, OrderType } from '@core/types'
import { Icon, Image, TabMenu, TabMenuItem, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { CoinAccountListOption } from 'components/Form'
import { model } from 'data'
import { getCoinFromPair, getFiatFromPair } from 'data/components/buySell/model'
import { getCoins } from 'data/components/swap/selectors'
import { SwapAccountType } from 'data/types'

import { Props as OwnProps, SuccessStateType } from '../index'
import CryptoItem from './CryptoItem'
import SellEmptyState from './SellEmptyState'

const { FORM_BS_CHECKOUT, FORM_BS_CRYPTO_SELECTION } = model.components.buySell

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

  shouldComponentUpdate = (nextProps, nextState) =>
    !equals(this.props, nextProps) || !equals(this.state, nextState)

  setOrderType = (orderType: OrderType) => this.setState({ orderType })

  handleBuy = (pair: BSPairType) => {
    const currentTier = this.props.userData?.tiers?.current

    // if first time user, send to verify email step which is required future SDD check
    if (!this.props.emailVerified && currentTier !== 2 && currentTier !== 1) {
      return this.props.buySellActions.setStep({
        cryptoCurrency: getCoinFromPair(pair.pair),
        fiatCurrency: getFiatFromPair(pair.pair),
        orderType: this.props.orderType,
        pair,
        step: 'VERIFY_EMAIL'
      })
    }

    // if SDD user has already placed on order, force them to Gold upgrade
    if (currentTier === 3 && this.props.sbOrders?.length > 0) {
      return this.props.buySellActions.setStep({
        step: 'UPGRADE_TO_GOLD'
      })
    }

    // default continue to enter amount step
    return this.props.buySellActions.setStep({
      cryptoCurrency: getCoinFromPair(pair.pair),
      fiatCurrency: getFiatFromPair(pair.pair),
      orderType: this.props.orderType,
      pair,
      step: 'ENTER_AMOUNT'
    })
  }

  handleSell = (swapAccount: SwapAccountType) => {
    const pair = this.props.pairs.find((value) => getCoinFromPair(value.pair) === swapAccount.coin)

    if (!pair) return

    this.props.buySellActions.setStep({
      cryptoCurrency: getCoinFromPair(pair.pair),
      fiatCurrency: getFiatFromPair(pair.pair),
      orderType: this.props.orderType,
      pair,
      step: 'ENTER_AMOUNT',
      swapAccount
    })
    // reset form values so order doesn't hold values
    // if user changes wallet/coin

    this.props.formActions.change(FORM_BS_CHECKOUT, 'amount', '')
  }

  // Check to see if any accounts have balance
  checkBalances = () =>
    // @ts-ignore
    any((hasFunds) => hasFunds)(
      // @ts-ignore
      values(
        // @ts-ignore
        map(
          // @ts-ignore
          (coin) => any((acct) => acct.balance !== 0 && acct.balance !== '0')(coin),
          // @ts-ignore
          this.props.accounts
        )
      )
    )

  render() {
    const showWelcome = this.props.isFirstLogin && !this.props.sddTransactionFinished

    const checkAccountsBalances = this.checkBalances()

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
              checkAccountsBalances ? (
                getCoins().map((coin) => {
                  const accounts = this.props.accounts[coin] as Array<SwapAccountType>
                  return accounts.map(
                    (account) =>
                      account.balance !== '0' &&
                      account.balance !== 0 && (
                        <CoinAccountListOption
                          key={`${account.baseCoin}-${account.index}`}
                          account={account}
                          coin={account.coin}
                          isAccountSelected={false}
                          isSwap={false}
                          onClick={() => this.handleSell(account)}
                          showLowFeeBadges
                          walletCurrency={this.props.walletCurrency}
                        />
                      )
                  )
                })
              ) : (
                <SellEmptyState handleClose={this.props.handleClose} />
              )
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
