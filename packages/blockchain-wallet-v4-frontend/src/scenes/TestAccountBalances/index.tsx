import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'

import { CoinType } from '@core/types'
import { selectors } from 'data'

const AccountTestBalances: React.FC<Props> = (props: Props) => {
  return <></>
  //   return props.data.cata({
  //     Failure: () => <>Failure</>,
  //     Loading: () => <>Loading</>,
  //     NotAsked: () => <>Not Asked</>,
  //     Success: (val) => <>val</>
  //   })
}

const mapStateToProps = (state) => ({})

const connector = connect(mapStateToProps)

export type OwnProps = {
  coin: CoinType
}

type Props = ConnectedProps<typeof connector> & OwnProps

export default connector(AccountTestBalances)
