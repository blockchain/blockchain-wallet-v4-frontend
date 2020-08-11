import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { CoinType, FiatType, SBOrderActionType } from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'

import React, { PureComponent } from 'react'
import Success from './template.success'

class CryptoItem extends PureComponent<Props> {
  render () {
    return this.props.data.cata({
      Success: val => <Success {...this.props} {...val} />,
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  miscActions: bindActionCreators(actions.core.data.misc, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  coin: CoinType
  cryptoSelection: boolean
  fiat: FiatType
  onClick?: (string) => void
  orderType: SBOrderActionType
}
export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CryptoItem)
