import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'

import { CoinType } from '@core/types'
import { selectors } from 'data'

import { getData } from './selectors'
import NonCustodialTestBalances from './template'

const NCTestBalances: React.FC<Props> = (props: Props) => {
  return props.data.cata({
    Failure: () => <>Failure</>,
    Loading: () => <>Loading</>,
    NotAsked: () => <>Not Asked</>,
    Success: (val) => <NonCustodialTestBalances />
  })
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const connector = connect(mapStateToProps)

export type OwnProps = {
  coin: CoinType
}

type Props = ConnectedProps<typeof connector> & OwnProps

export default connector(NCTestBalances)
