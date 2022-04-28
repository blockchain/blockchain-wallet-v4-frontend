import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { colors } from '@blockchain-com/constellation'
import { bindActionCreators, compose } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { useRemote } from 'hooks'
import { Field, reduxForm } from 'redux-form'

import { convertCoinToCoin, convertCoinToFiat, convertFiatToCoin } from '@core/exchange'
import { GasCalculationOperations, GasDataI } from '@core/network/api/nfts/types'
import { getRatesSelector } from '@core/redux/data/misc/selectors'
import { RatesType } from '@core/types'
import { CheckBoxInput, Icon, Link, SpinningLoader, Text } from 'blockchain-info-components'
import { getEthBalances } from 'components/Balances/selectors'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { StickyHeaderWrapper, Title } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import { Row, Value } from 'components/Flyout/model'
import AmountFieldInput from 'components/Form/AmountFieldInput'
import SelectBox from 'components/Form/SelectBox'
import { actions, selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { orderFromJSON } from 'data/components/nfts/utils'

import { AssetDesc, FullAssetImage, StickyCTA } from '../../components'
import { Props as OwnProps } from '..'
import BuyCta from './cta'
import BuyFees from './fees'

const Buy: React.FC<Props> = (props) => {
  const {
    close,
    erc20BalanceR,
    ethBalancesR,
    formActions,
    formValues,
    nftActions,
    orderFlow,
    rates,
    walletCurrency
  } = props
  const { amount, coin, fix } = formValues
  const { orderToMatch } = orderFlow

  const cryptoAmt =
    fix === 'FIAT'
      ? convertFiatToCoin({
          coin,
          currency: walletCurrency,
          maxPrecision: 8,
          rates,
          value: amount
        })
      : amount
  const fiatAmt =
    fix === 'CRYPTO'
      ? convertCoinToFiat({
          coin,
          currency: walletCurrency,
          isStandard: true,
          rates,
          value: amount || 0
        })
      : amount
  const [selfCustodyBalance, custodialBalance] = ethBalancesR.getOrElse([
    new BigNumber(0),
    new BigNumber(0)
  ])

  const openSeaOrders = useRemote(selectors.components.nfts.getOpenSeaOrders)
  const sellOrders =
    openSeaOrders.data?.filter((x) => {
      return x.side === 1
    }) || []
  const lowest_order = sellOrders.sort((a, b) =>
    new BigNumber(a.base_price).isLessThan(b.base_price) ? -1 : 1
  )[0]

  const ethBalance = new BigNumber(selfCustodyBalance)
  const buyFees = orderFlow.fees.getOrElse({ gasPrice: 0, totalFees: 0 } as GasDataI)
  const maxBuyPossible = ethBalance.minus(buyFees.totalFees * buyFees.gasPrice).abs()
  const ethStandard = convertCoinToCoin({
    baseToStandard: true,
    coin,
    value: lowest_order.base_price
  })
  const ethCurrency = convertCoinToFiat({
    coin,
    currency: walletCurrency,
    rates,
    value: lowest_order.base_price
  })
  formValues.amount = ethStandard
  const amtToBuy = new BigNumber(lowest_order.base_price).minus(ethBalance)

  return (
    <>
      {orderFlow.asset.cata({
        Failure: (e) => <Text>{e}</Text>,
        Loading: () => (
          <AssetDesc>
            <SpinningLoader width='14px' height='14px' borderWidth='3px' />
          </AssetDesc>
        ),
        NotAsked: () => null,
        Success: (val) => (
          <>
            <StickyHeaderWrapper>
              <FlyoutHeader
                data-e2e='wrapEthHeader'
                mode='back'
                onClick={() => nftActions.setOrderFlowStep({ step: NftOrderStepEnum.SHOW_ASSET })}
              >
                Buy
              </FlyoutHeader>
            </StickyHeaderWrapper>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                margin: '0em 0em 28em 0em'
              }}
            >
              <Row>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex' }}>
                    <img
                      style={{
                        borderRadius: '8px',
                        height: '64px',
                        marginRight: '12px',
                        width: 'auto'
                      }}
                      alt='nft-asset'
                      src={val.image_url.replace(/=s\d*/, '')}
                    />
                    <div>
                      <Text size='16px' color='grey900' weight={600}>
                        {val?.name}
                      </Text>
                      {val.collection.safelist_request_status === 'verified' ? (
                        <Text
                          size='14px'
                          weight={600}
                          color='green600'
                          style={{
                            background: colors.green100,
                            borderRadius: '8px',
                            padding: '5px 8px',
                            textAlign: 'center',
                            width: 'fit-content'
                          }}
                        >
                          Verified
                        </Text>
                      ) : (
                        <Text
                          size='14px'
                          weight={600}
                          color='orange600'
                          style={{
                            background: colors.orange100,
                            borderRadius: '8px',
                            padding: '5px 8px',
                            textAlign: 'center',
                            width: 'fit-content'
                          }}
                        >
                          Not Verified
                        </Text>
                      )}
                    </div>
                  </div>
                  <Text
                    style={{
                      justifyContent: 'right'
                    }}
                  >
                    <CoinDisplay
                      size='14px'
                      color='black'
                      weight={600}
                      coin='ETH'
                      style={{ justifyContent: 'right' }}
                    >
                      {lowest_order?.base_price || 0}
                    </CoinDisplay>
                    <FiatDisplay
                      size='14px'
                      color={colors.grey600}
                      weight={600}
                      coin='ETH'
                      style={{ justifyContent: 'right' }}
                    >
                      {lowest_order?.base_price || 0}
                    </FiatDisplay>
                  </Text>
                </div>
              </Row>
              <Row>
                <Title>
                  <b>
                    <FormattedMessage id='copy.buy_with' defaultMessage='Buy With' />
                  </b>
                </Title>
                <Value>
                  <Field
                    name='coin'
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(coin: any) => {
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      const address = window.coins[coin].coinfig.type.erc20Address!

                      nftActions.fetchFees({
                        operation: GasCalculationOperations.Buy,
                        order: orderFromJSON(orderToMatch),
                        paymentTokenAddress: address
                      })
                    }}
                    component={SelectBox}
                    elements={[
                      {
                        group: '',
                        items: val.collection.payment_tokens
                          .map((token) => token.symbol)
                          .filter((symbol) => !!window.coins[symbol])
                          .filter((symbol) => !window.coins[symbol].coinfig.type.erc20Address)
                          .map((coin) => ({
                            text: window.coins[coin].coinfig.symbol,
                            value: window.coins[coin].coinfig.symbol
                          }))
                      }
                    ]}
                  />
                </Value>
              </Row>
            </div>
            <StickyCTA>
              <BuyFees {...props} />
              <BuyCta
                {...props}
                amount={cryptoAmt}
                amtToBuy={amtToBuy}
                maxBuyPossible={maxBuyPossible}
              />
            </StickyCTA>
          </>
        )
      })}
    </>
  )
}
const mapStateToProps = (state) => ({
  erc20BalanceR: selectors.core.data.eth.getErc20Balance(
    state,
    // @ts-ignore
    selectors.form.getFormValues('nftBuy')(state)?.coin || 'WETH'
  ),
  ethBalancesR: getEthBalances(state),
  formValues: selectors.form.getFormValues('nftBuy')(state) as {
    amount: string
    coin: string
    expirationDays: string
    fix: string
  },
  rates: getRatesSelector('WETH', state).getOrElse({} as RatesType),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})
const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  reduxForm<{}, OwnProps>({
    destroyOnUnmount: false,
    form: 'nftBuy',
    initialValues: {
      amount: 0,
      coin: 'ETH',
      fix: 'CRYPTO'
    }
  }),
  connector
)

type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(Buy) as React.FC<OwnProps>
