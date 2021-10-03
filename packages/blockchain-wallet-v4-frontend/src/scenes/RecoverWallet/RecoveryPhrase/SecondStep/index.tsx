import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'

import { Props as OwnProps } from '../..'
import { SpinningLoaderCentered } from '../../model'
import Error from './failure.template'
import Recover from './template'

class RecoverContainer extends React.PureComponent<Props> {
  componentDidMount() {
    const { authActions, mnemonic } = this.props
    authActions.restoreFromMetadata(mnemonic)
  }

  render() {
    const { kycReset, metadataRestore, previousStep, recoverPassword, restoringR } = this.props
    const isRestoring = Remote.Loading.is(restoringR)

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
  metadataRestore: selectors.auth.getMetadataRestore(state) as any,
  restoringR: selectors.auth.getRestoring(state) as any
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
