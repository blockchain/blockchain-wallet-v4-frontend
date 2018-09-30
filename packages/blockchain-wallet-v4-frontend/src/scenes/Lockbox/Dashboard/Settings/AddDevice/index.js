import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import AddDevice from './template.js'

class AddDeviceContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick () {
    this.props.modalActions.showModal('LockboxSetup')
  }

  render () {
    return (
      <AddDevice
        onClick={this.onClick}
        isBrowserChrome={this.props.isBrowserChrome}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

AddDeviceContainer.propTypes = {
  isBrowserChrome: PropTypes.bool.isRequired
}

export default connect(
  null,
  mapDispatchToProps
)(AddDeviceContainer)
