import React, { memo, useEffect, useMemo } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'

import { TimeRange } from '@core/types'
import { actions } from 'data'

import { CoinHeader } from '..'
import { AboutSection } from '../AboutSection'
import { CoinPage } from './CoinPage'
import { getData } from './selectors'
import { CoinPageContainerComponent } from './types'

export type { CoinPageComponent, CoinPageProps } from './types'

const CoinPageContainer: CoinPageContainerComponent<Props> = memo(
  ({ coin, data, priceChartActions }) => {
    const displayName = useMemo(() => window.coins[coin].coinfig.name, [coin])

    useEffect(() => {
      priceChartActions.initialized(coin, TimeRange.WEEK)
    }, [coin, priceChartActions])

    return data.cata({
      Failure: () => <></>,
      Loading: () => <>Loading...</>,
      NotAsked: () => <>Not Asked</>,
      Success: (value) => (
        <CoinPage
          about={<AboutSection content='' title={coin} actions={[<></>]} />}
          chart={JSON.stringify(value)}
          header={
            <CoinHeader
              coinCode={coin}
              coinDescription="The internet's first and largest crypto currency."
              coinName={displayName}
            />
          }
        />
      )
    })
  }
)

const mapStateToProps = (state, ownProps) => getData(state, ownProps)
const mapDispatchToProps = (dispatch) => ({
  priceChartActions: bindActionCreators(actions.components.priceChart, dispatch)
})
const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(CoinPageContainer)
