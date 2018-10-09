import React from 'react'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { pathOr } from 'ramda'

import { actions } from 'data'
import { getData } from './selectors'
import SecurityCenter from './template.js'

class SecurityCenterContainer extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleEnable = this.handleEnable.bind(this)
    this.onClose = this.onClose.bind(this)
    this.setView = this.setView.bind(this)

    this.state = {
      editing: false,
      enabling: false,
      viewing: 'security',
      changeEmail: pathOr(false, ['location', 'state', 'changeEmail'], props)
    }
  }

  componentWillUnmount () {
    this.onClose()
  }

  handleEnable (step) {
    this.setState({ enabling: step })
  }

  onClose () {
    if (this.state.enabling === 'recovery') {
      this.props.settingsActions.removeRecoveryPhrase()
    }
    this.setState({ enabling: false })
  }

  determineProgress () {
    const { authType, emailVerified, isMnemonicVerified } = this.props
    let progress = 0
    if (authType.getOrElse(0) > 0) progress++
    if (emailVerified.getOrElse(0) > 0) progress++
    if (isMnemonicVerified) progress++
    return progress
  }

  setView (tab) {
    this.setState({ viewing: tab })
  }

  render () {
    return (
      <SecurityCenter
        progress={this.determineProgress()}
        data={this.props}
        editing={this.state.editing}
        enabling={this.state.enabling}
        handleEnable={this.handleEnable}
        onClose={this.onClose}
        viewing={this.state.viewing}
        setView={this.setView}
        changeEmail={this.state.changeEmail}
        isMnemonicVerified={this.props.isMnemonicVerified}
      />
    )
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SecurityCenterContainer)
)
