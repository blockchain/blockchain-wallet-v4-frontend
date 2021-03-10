import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import moment from 'moment'
import { bindActionCreators } from 'redux'

import { actions, model } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import LockTime from './template'

const { WITHDRAW_LOCK_DEFAULT_DAYS } = model.profile

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
          lockTime={
            val.withdrawLockCheck && val.withdrawLockCheck.lockTime
              ? moment
                  .duration(val.withdrawLockCheck.lockTime, 'seconds')
                  .days()
              : WITHDRAW_LOCK_DEFAULT_DAYS
          }
        />
      ),
      Failure: () => (
        <LockTime {...rest} lockTime={WITHDRAW_LOCK_DEFAULT_DAYS} />
      ),
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
  lockTime: number
}

export type Props = ConnectedProps<typeof connector>

export default connector(LockTimeContainer)
