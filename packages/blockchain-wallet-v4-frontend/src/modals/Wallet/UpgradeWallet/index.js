import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import UpgradeWallet from './template.js'

class UpgradeContainer extends React.PureComponent {
  componentDidMount () {
    this.props.authActions.upgradeWallet(this.props.version)
  }

  render () {
    return (
      <UpgradeWallet {...this.props} handleContinue={this.handleContinue} />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch)
})

const enhance = compose(
  modalEnhancer('UpgradeWallet'),
  connect(
    undefined,
    mapDispatchToProps
  )
)

export default enhance(UpgradeContainer)
