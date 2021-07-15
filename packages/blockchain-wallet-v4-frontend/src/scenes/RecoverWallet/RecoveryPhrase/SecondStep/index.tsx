import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { SpinningLoader } from 'blockchain-info-components'
import { actions, selectors } from 'data'

import { Props as OwnProps } from '../..'
import Error from './error.template'
import Recover from './template'

class RecoverContainer extends React.PureComponent<Props> {
  componentDidMount() {
    const { authActions, mnemonic } = this.props
    authActions.restoreFromMetadata(mnemonic)
  }

  render() {
    const { kycReset, metadataRestore, previousStep, recoverPassword, restoring } = this.props
    const isRestoring = restoring.cata({
      Failure: () => false,
      Loading: () => true,
      NotAsked: () => false,
      Success: () => false
    })

    return metadataRestore.cata({
      Failure: () =>
        kycReset ? <Recover {...this.props} /> : <Error previousStep={previousStep} />,
      Loading: () => <SpinningLoader width='36px' height='36px' />,
      NotAsked: () => <SpinningLoader width='36px' height='36px' />,
      Success: (val) => (
        <Recover
          isRestoring={isRestoring}
          isRestoringFromMetadata={val && !!val.sharedKey}
          {...this.props}
        />
      )
    })
  }
}

const mapStateToProps = (state) => ({
  // TODO: find out what kind of object this is
  metadataRestore: selectors.auth.getMetadataRestore(state) as any,
  restoring: selectors.auth.getRestoring(state) as any
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector> &
  OwnProps & {
    previousStep: () => void
  }

export default connect(mapStateToProps, mapDispatchToProps)(RecoverContainer)
