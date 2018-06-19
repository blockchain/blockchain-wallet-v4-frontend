import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'
import { getData } from './selectors'
import Success from './template.success'
import Error from './template.error'
import Loading from './template.loading'

class GoogleAuthContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount () {
    this.props.securityCenterActions.getGoogleAuthenticatorSecretUrl()
  }

  componentDidUpdate (prevProps) {
    const next = this.props.data.getOrElse({})
    const prev = prevProps.data.getOrElse({})
    if (next.authType !== prev.authType) {
      this.props.updateUI({ successToggled: true })
      this.props.triggerSuccess()
      this.props.goBackOnSuccess()
      this.props.handleGoBack()
    }
  }

  handleClick () {
    this.props.modalActions.showModal('TwoStepSetup')
  }

  onSubmit () {
    this.props.securityCenterActions.verifyGoogleAuthenticator(this.props.authCode)
  }

  render () {
    const { data, ui, ...rest } = this.props

    return data.cata({
      Success: (value) => <Success
        data={value}
        handleClick={this.handleClick}
        onSubmit={this.onSubmit}
        ui={ui}
      />,
      Failure: (message) => <Error {...rest} message={message} />,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />
    })
  }
}

const mapStateToProps = (state) => ({
  authCode: formValueSelector('securityGoogleAuthenticator')(state, 'authCode'),
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Security_TwoFactor', state: { updateToggled: false, successToggled: false } })
)

export default enhance(GoogleAuthContainer)
