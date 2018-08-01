import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'

import NameDeviceStep from './template'
import { formValueSelector } from 'redux-form'

class NameDeviceStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit () {
    this.props.lockboxActions.addDevice(this.props.deviceName)
  }

  render () {
    return <NameDeviceStep onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = state => ({
  deviceName: formValueSelector('lockboxNameDevice')(state, 'deviceName')
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NameDeviceStepContainer)
