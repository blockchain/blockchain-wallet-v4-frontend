import React, { memo, useCallback, useMemo } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'

import { Exchange } from '@core'
import { fiatToString } from '@core/exchange/utils'
import { CoinType, OrderType } from '@core/types'
import { actions } from 'data'
import { ModalName } from 'data/types'

import { CoinHeader } from '..'
import { AboutSection } from '../AboutSection'
import { ChartBalancePanel } from '../ChartBalancePanel'
import { HoldingsCard } from '../HoldingsCard'
import { CoinPage } from './CoinPage'
import { useChart, useWalletsCard, useTabs } from './hooks'
import { HoldingsCardActions } from './model'
import { getData } from './selectors'
import { CoinPageContainerComponent } from './types'

export type { CoinPageComponent, CoinPageProps } from './types'

const CoinPageContainer: CoinPageContainerComponent<Props> = memo(
  ({
    buyButtonHandler,
    coin,
    currency,
    data,
    // priceChartActions,
    receiveButtonHandler,
    sellButtonHandler,
    sendButtonHandler
  }) => {
    const [tabsNode, { selectedTimeRange }] = useTabs({ coin })

    const [chart] = useChart({
      timeRange: selectedTimeRange
    })
    const [walletsCard] = useWalletsCard(coin)

    const { coinfig } = useMemo(() => window.coins[coin], [coin])
    const displayName = useMemo(() => coinfig.name, [coinfig.name])

    const buyButtonCallback = useCallback(() => buyButtonHandler(coin), [buyButtonHandler, coin])
    const sellButtonCallback = useCallback(() => sellButtonHandler(coin), [sellButtonHandler, coin])
    const sendButtonCallback = useCallback(() => sendButtonHandler(coin), [sendButtonHandler, coin])
    const receiveButtonCallback = useCallback(
      () => receiveButtonHandler(coin),
      [receiveButtonHandler, coin]
    )

    return data.cata({
      Failure: () => <>Failure</>,
      Loading: () => <>Loading...</>,
      NotAsked: () => <>Not Asked</>,
      Success: (value) => {
        const { balanceData, rates } = value
        const { products } = coinfig
        const totalFiatAmount = Exchange.convertCoinToFiat({
          coin,
          currency,
          isStandard: false,
          rates,
          value: balanceData
        })
        const totalFiatFormatted = fiatToString({ unit: currency, value: totalFiatAmount })
        const coinTotalAmount = Exchange.displayCoinToCoin({
          coin,
          isFiat: coinfig.type.name === 'FIAT',
          value: balanceData
        })

        const holdingsCardActions = HoldingsCardActions({
          amount: Number(coinTotalAmount),
          buyButtonCallback,
          products,
          receiveButtonCallback,
          sellButtonCallback,
          sendButtonCallback
        })

        return (
          <CoinPage
            chartTabs={tabsNode}
            about={<AboutSection content='' title={coin} actions={[<></>]} />}
            chart={chart}
            header={<CoinHeader coinCode={coin} coinDescription='' coinName={displayName} />}
            chartBalancePanel={
              <ChartBalancePanel
                coinCode={coin}
                pastHourDelta={value.priceChange.overallChange.percentChange}
                pastHourPrice={value.priceChange.overallChange.diff}
                price={value.priceChange.currentPrice}
              />
            }
            // alertCard={<AlertCard content='' />}
            holdings={
              <HoldingsCard
                actions={holdingsCardActions}
                total={totalFiatFormatted}
                coinCode={coin}
                coinTotal={coinTotalAmount}
              />
            }
            wallets={walletsCard}
          />
        )
      }
    })
  }
)

const mapStateToProps = (state, ownProps) => getData(state, ownProps)

const mapDispatchToProps = (dispatch) => ({
  buyButtonHandler: (coin: CoinType) => {
    dispatch(
      actions.components.buySell.showModal({
        cryptoCurrency: coin,
        orderType: OrderType.BUY,
        origin: 'CoinPageHoldings'
      })
    )
  },
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  // priceChartActions: bindActionCreators(actions.components.priceChart, dispatch),
  receiveButtonHandler: (coin: CoinType) => {
    dispatch(
      actions.modals.showModal(ModalName.REQUEST_CRYPTO_MODAL, {
        origin: 'CoinPageHoldings',
        preselectedCoin: coin
      })
    )
  },
  sellButtonHandler: (coin: CoinType) => {
    dispatch(
      actions.components.buySell.showModal({
        cryptoCurrency: coin,
        orderType: OrderType.SELL,
        origin: 'CoinPageHoldings'
      })
    )
  },
  sendButtonHandler: (coin: CoinType) => {
    dispatch(
      actions.modals.showModal(ModalName.SEND_CRYPTO_MODAL, {
        coin,
        origin: 'CoinPageHoldings'
      })
    )
  }
})
const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(CoinPageContainer)
