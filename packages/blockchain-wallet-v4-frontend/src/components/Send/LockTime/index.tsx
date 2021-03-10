import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import moment from 'moment'
import { bindActionCreators } from 'redux'

import { CoinType } from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import LockTime from './template'

class LockTimeContainer extends React.PureComponent<Props> {
  componentDidMount() {
    const { sendActions } = this.props
    sendActions.getLockRule()
  }

  render() {
    const { data, ...rest } = this.props

    return data.cata({
      Success: val => (
        <LockTime
          {...rest}
          lockTime={moment
            .duration(val.withdrawLockCheck.lockTime, 'seconds')
            .days()}
        />
      ),
      Failure: () => null,
      NotAsked: () => null,
      Loading: () => null
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  sendActions: bindActionCreators(actions.components.send, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  coin: CoinType
  withdrawable?: string
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(LockTimeContainer)
