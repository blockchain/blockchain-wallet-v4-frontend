import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import moment from 'moment'
import React from 'react'

import { actions } from 'data'
import { CoinType } from 'core/types'
import { getData } from './selectors'
import LockTime from './template'

class LockTimeContainer extends React.PureComponent<Props> {
  componentDidMount () {
    const { sendActions } = this.props
    sendActions.getLockRule()
  }

  render () {
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
