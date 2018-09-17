import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import LockboxAppInstall from './template'

class LockboxAppInstallContainer extends React.PureComponent {
  componentDidMount () {
    this.props.lockboxActions.installBlockchainApps(this.props.deviceIndex)
  }

  render () {
    return <LockboxAppInstall {...this.props} />
  }
}

LockboxAppInstallContainer.propTypes = {
  deviceIndex: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

const enhance = compose(
  modalEnhancer('LockboxAppInstall'),
  connect(
    null,
    mapDispatchToProps
  )
)

export default enhance(LockboxAppInstallContainer)
