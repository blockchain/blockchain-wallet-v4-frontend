
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions, selectors } from 'data'
import Google from './template.js'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import ui from 'redux-ui'
import { formValueSelector } from 'redux-form'

class GoogleAuthContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    this.props.securityCenterActions.getGoogleAuthenticatorSecretUrl()
  }

  handleClick () {
    this.props.modalActions.showModal('TwoStepSetup')
  }

  handleSubmit () {
    // TODO: create the below
    this.props.securityCenterActions.verifyGoogleAuthenticator()
  }

  render () {
    console.log('render google auth', this.props)
    const { data, ...rest } = this.props
    // return <Google
    //   {...this.props}
    //   handleClick={this.handleClick}
    //   handleSubmit={this.handleSubmit}
    // />

    return data.cata({
      Success: (value) => <Google {...rest}
        data={value}
        handleClick={this.handleClick}
        handleSubmit={this.handleSubmit}
      />,
      Failure: (message) => <Error {...rest}
        message={message} />,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />
    })
  }
}

const mapStateToProps = (state) => ({
  // authType: selectors.core.settings.getAuthType(state),
  // googleAuthSecretUrl: selectors.core.settings.getGoogleAuthSecretUrl(state)
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Security_TwoFactor', state: { updateToggled: false } })
)

export default enhance(GoogleAuthContainer)
// export default connect(mapStateToProps, mapDispatchToProps)(GoogleAuthContainer)
