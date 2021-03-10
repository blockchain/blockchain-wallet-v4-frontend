import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'

import { getFormValues } from './selectors'
import LockboxMenu from './template'

class LockboxMenuContainer extends React.PureComponent {
  render() {
    const { data, ...rest } = this.props
    return data.cata({
      Success: val => (
        <LockboxMenu
          deviceInfo={val}
          location={this.props.location}
          deviceIndex={this.props.match.params.deviceIndex}
          {...rest}
        />
      ),
      Loading: () => <div />,
      Failure: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: selectors.core.kvStore.lockbox.getDevice(
    state,
    ownProps.match.params.deviceIndex
  ),
  formValues: getFormValues(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.lockbox, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)
export default enhance(LockboxMenuContainer)
