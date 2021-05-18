import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { SpinningLoader } from 'blockchain-info-components'
import { actions, selectors } from 'data'

import Recover from './template'

class RecoverContainer extends React.PureComponent {
  componentDidMount() {
    const { authActions, mnemonic } = this.props
    authActions.restoreFromMetadata(mnemonic)
  }

  onSubmit = () => {
    const { authActions, email, language, mnemonic, password } = this.props
    authActions.restore(mnemonic, email, password, language)
  }

  render() {
    const { metadataRestore, password, previousStep, registering } = this.props

    const isRegistering = registering.cata({
      Failure: () => false,
      Loading: () => true,
      NotAsked: () => false,
      Success: () => false
    })

    return metadataRestore.cata({
      Failure: () => (
        <Recover
          previousStep={previousStep}
          onSubmit={this.onSubmit}
          isRegistering={isRegistering}
          password={password}
        />
      ),
      Loading: () => <SpinningLoader width='36px' height='36px' />,
      NotAsked: () => <SpinningLoader width='36px' height='36px' />,
      Success: (val) => (
        <Recover
          previousStep={previousStep}
          onSubmit={this.onSubmit}
          isRegistering={isRegistering}
          isRestoringFromMetadata={val && !!val.sharedKey}
          password={password}
        />
      )
    })
  }
}

const mapStateToProps = (state) => ({
  email: formValueSelector('recover')(state, 'email'),
  language: selectors.preferences.getLanguage(state),
  metadataRestore: selectors.auth.getMetadataRestore(state),
  mnemonic: formValueSelector('recover')(state, 'mnemonic'),
  password: formValueSelector('recover')(state, 'password') || '',
  registering: selectors.auth.getRegistering(state)
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RecoverContainer)
