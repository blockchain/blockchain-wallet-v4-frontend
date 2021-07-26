import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { any, map, values } from 'ramda'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Icon, Image, TabMenu, TabMenuItem, Text } from 'blockchain-info-components'
import { OrderType, SBPairType } from 'blockchain-wallet-v4/src/types'
import { FlyoutWrapper } from 'components/Flyout'
import { CoinAccountListOption } from 'components/Form'
import { model } from 'data'
import { getCoinFromPair, getFiatFromPair } from 'data/components/simpleBuy/model'
import { getCoins } from 'data/components/swap/selectors'
import { SwapAccountType } from 'data/types'

import { Props as OwnProps, SuccessStateType } from '../index'
import CryptoItem from './CryptoItem'
import SellEmptyState from './SellEmptyState'

const { SB_CRYPTO_SELECTION } = model.components.simpleBuy

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

const CryptoSelector: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const [orderType, setOrderType] = useState(props.orderType)
  const showWelcome = props.isFirstLogin && !props.sddTransactionFinished

  const handleBuy = (pair: SBPairType) => {
    const currentTier = props.userData?.tiers?.current

    // if first time user, send to verify email step which is required future SDD check
    if (!props.emailVerified && currentTier !== 2 && currentTier !== 1) {
      return props.simpleBuyActions.setStep({
        cryptoCurrency: getCoinFromPair(pair.pair),
        fiatCurrency: getFiatFromPair(pair.pair),
        orderType,
        pair,
        step: 'VERIFY_EMAIL'
      })
    }

    // if SDD user has already placed on order, force them to Gold upgrade
    if (currentTier === 3 && props.sbOrders?.length > 0) {
      return props.simpleBuyActions.setStep({
        step: 'UPGRADE_TO_GOLD'
      })
    }

    // default continue to enter amount step
    return props.simpleBuyActions.setStep({
      cryptoCurrency: getCoinFromPair(pair.pair),
      fiatCurrency: getFiatFromPair(pair.pair),
      orderType,
      pair,
      step: 'ENTER_AMOUNT'
    })
  }

  const handleSell = (swapAccount: SwapAccountType) => {
    const pair = props.pairs.find((value) => getCoinFromPair(value.pair) === swapAccount.coin)

    if (!pair) return

    props.simpleBuyActions.setStep({
      cryptoCurrency: getCoinFromPair(pair.pair),
      fiatCurrency: getFiatFromPair(pair.pair),
      orderType,
      pair,
      step: 'ENTER_AMOUNT',
      swapAccount
    })
    // reset form values so order doesn't hold values
    // if user changes wallet/coin
    props.formActions.change('simpleBuyCheckout', 'amount', '')
  }

  // Check to see if any accounts have balance
  // @ts-ignore
  const checkAccountsBalances = any((hasFunds) => hasFunds)(
    // @ts-ignore
    values(
      // @ts-ignore
      map(
        // @ts-ignore
        (coin) => any((acct) => acct.balance !== 0 && acct.balance !== '0')(coin),
        // @ts-ignore
        props.accounts
      )
    )
  )

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
              onClick={props.handleClose}
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
                  selected={orderType === 'BUY'}
                  onClick={() => {
                    setOrderType('BUY')
                    props.simpleBuyActions.setBuyCrypto('CurrencyList')
                  }}
                  data-e2e='sbBuyButton'
                >
                  <FormattedMessage id='buttons.buy_crypto' defaultMessage='Buy Crypto' />
                </TabMenuItem>
                <TabMenuItem
                  role='button'
                  selected={orderType === OrderType.SELL}
                  onClick={() => {
                    setOrderType(OrderType.SELL)
                    props.simpleBuyActions.setSellCrypto('CurrencyList')
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
          {orderType === OrderType.SELL ? (
            checkAccountsBalances ? (
              getCoins().map((coin) => {
                const accounts = props.accounts[coin] as Array<SwapAccountType>
                return accounts.map(
                  (account) =>
                    account.balance !== '0' &&
                    account.balance !== 0 && (
                      <CoinAccountListOption
                        key={account.index}
                        account={account}
                        coin={account.coin}
                        isAccountSelected={false}
                        isSwap={false}
                        onClick={() => handleSell(account)}
                        showLowFeeBadges
                        walletCurrency={props.walletCurrency}
                      />
                    )
                )
              })
            ) : (
              <SellEmptyState handleClose={props.handleClose} />
            )
          ) : (
            props.pairs.map((value) => (
              <CryptoItem
                key={`${getFiatFromPair(value.pair)}-${getCoinFromPair(value.pair)}`}
                orderType={orderType}
                fiat={getFiatFromPair(value.pair)}
                coin={getCoinFromPair(value.pair)}
                onClick={() => handleBuy(value as SBPairType)}
              />
            ))
          )}
        </Currencies>
      </Form>
    </Wrapper>
  )
}

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: SB_CRYPTO_SELECTION
})(CryptoSelector)
