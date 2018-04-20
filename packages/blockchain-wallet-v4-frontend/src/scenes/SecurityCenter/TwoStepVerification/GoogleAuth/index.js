import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import Google from './template.success'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import ui from 'redux-ui'
import { formValueSelector } from 'redux-form'

class GoogleAuthContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    this.props.securityCenterActions.getGoogleAuthenticatorSecretUrl()
  }

  componentDidUpdate (prevProps) {
    const next = this.props.data.data
    const prev = prevProps.data.data
    if (next.authType !== prev.authType) {
      this.props.updateUI({ successToggled: true })
      setTimeout(() => {
        this.props.goBackOnSuccess()
        this.props.handleGoBack()
      }, 1500)
    }
  }

  handleClick () {
    this.props.modalActions.showModal('TwoStepSetup')
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.securityCenterActions.verifyGoogleAuthenticator(this.props.authCode)
  }

  render () {
    const { data, ui, ...rest } = this.props

    return data.cata({
      Success: (value) => <Google
        data={value}
        handleClick={this.handleClick}
        handleSubmit={this.handleSubmit}
        ui={ui}
      />,
      Failure: (message) => <Error {...rest}
        message={message} />,
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
