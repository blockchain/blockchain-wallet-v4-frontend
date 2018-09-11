import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import { actions, selectors } from 'data'
import LockboxMenu from './template'

class LockboxMenuContainer extends React.PureComponent {
  render () {
    const { data } = this.props
    return data.cata({
      Success: val => (
        <LockboxMenu deviceInfo={val} location={this.props.location} />
      ),
      Loading: () => <div>Loading</div>,
      Failure: () => <div>Failure</div>,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: selectors.core.kvStore.lockbox.getDevice(
    state,
    ownProps.match.params.deviceId
  )
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.lockbox, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)
export default enhance(LockboxMenuContainer)
