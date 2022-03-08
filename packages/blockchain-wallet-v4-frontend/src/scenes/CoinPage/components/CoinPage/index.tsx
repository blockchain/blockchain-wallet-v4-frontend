import React, { memo, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'

import { TimeRange } from '@core/types'
import { actions } from 'data'

import { AboutSection } from '../AboutSection'
import { CoinPage } from './CoinPage'
import { getData } from './selectors'
import { CoinPageContainerComponent } from './types'

export type { CoinPageComponent, CoinPageProps } from './types'

const CoinPageContainer: CoinPageContainerComponent<Props> = memo(
  ({ coin, data, priceChartActions }) => {
    useEffect(() => {
      priceChartActions.initialized(coin, TimeRange.WEEK)
    }, [coin, priceChartActions])

    return data.cata({
      Failure: () => <></>,
      Loading: () => <></>,
      NotAsked: () => <></>,
      Success: (value) => (
        <CoinPage
          about={<AboutSection content='' title={coin} actions={[<></>]} />}
          chart={JSON.stringify(value)}
          header={undefined}
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
