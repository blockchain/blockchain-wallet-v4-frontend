import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { equals } from 'ramda'

import { BSOrderActionType, BSPairType, CoinType, FiatType } from '@core/types'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import Success from './template.success'

class CryptoItem extends React.Component<Props> {
  shouldComponentUpdate = (nextProps) => !equals(this.props, nextProps)

  render() {
    return this.props.data.cata({
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null,
      Success: (val) => <Success {...this.props} {...val} />
    })
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps)
})

const connector = connect(mapStateToProps)

export type OwnProps = {
  coin: CoinType
  fiat: FiatType
  onClick?: (string) => void
  orderType: BSOrderActionType
  pair?: BSPairType
}
export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CryptoItem)
