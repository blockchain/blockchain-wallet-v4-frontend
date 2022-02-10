/* eslint-disable react/no-unused-state */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'
import * as C from 'services/alerts'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class GoogleAuthContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      notificationActive: false,
      successToggled: false,
      updateToggled: false
    }

    this.handleClick = this.handleClick.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleNotification = this.handleNotification.bind(this)
  }

  componentDidMount() {
    this.props.securityCenterActions.getGoogleAuthenticatorSecretUrl()
  }

  componentDidUpdate(prevProps) {
    const next = this.props.data.getOrElse({})
    const prev = prevProps.data.getOrElse({})
    if (next.authType !== prev.authType) {
      // eslint-disable-next-line  react/no-did-update-set-state
      this.setState((prevState) => ({
        successToggled: !prevState.successToggled
      }))
      this.props.triggerSuccess()
      this.props.goBackOnSuccess()
    }
  }

  handleClick() {
    this.props.modalActions.showModal('TWO_STEP_SETUP_MODAL')
  }

  handleNotification() {
    const { alertActions } = this.props
    this.setState({ notificationActive: true })
    this.timeout = setTimeout(() => {
      this.setState({ notificationActive: false })
    }, 2000)
    alertActions.displaySuccess(C.COPY_LINK_CLIPBOARD_SUCCESS)
  }

  onSubmit() {
    this.props.securityCenterActions.verifyGoogleAuthenticator(this.props.authCode)
  }

  render() {
    const { data, ...rest } = this.props

    return data.cata({
      Failure: (message) => <Error {...rest} message={message} />,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />,
      Success: (value) => (
        <Success
          data={value}
          handleNotification={this.handleNotification}
          handleClick={this.handleClick}
          onSubmit={this.onSubmit}
          uiState={this.state}
        />
      )
    })
  }
}

const mapStateToProps = (state) => ({
  authCode: formValueSelector('securityGoogleAuthenticator')(state, 'authCode'),
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(GoogleAuthContainer)
