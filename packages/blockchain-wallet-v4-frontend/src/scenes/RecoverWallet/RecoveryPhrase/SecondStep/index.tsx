import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import { Props as OwnProps } from '../..'
import { SpinningLoaderCentered } from '../../model'
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
        kycReset === false ? <Error previousStep={previousStep} /> : <Recover {...this.props} />,
      Loading: () => <SpinningLoaderCentered />,
      NotAsked: () => <SpinningLoaderCentered />,
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
