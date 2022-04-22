import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Remote } from '@core'
import { actions, selectors } from 'data'
import { Analytics } from 'data/analytics/types'

import { Props as OwnProps } from '../..'
import { SpinningLoaderCentered } from '../../model'
import Error from './failure.template'
import Recover from './template'

class RecoverContainer extends React.PureComponent<Props> {
  componentDidMount() {
    const { analyticsActions, formValues, signupActions } = this.props
    signupActions.restoreFromMetadata(formValues.mnemonic)
    analyticsActions.trackEvent({
      key: Analytics.RECOVERY_PHRASE_ENTERED,
      properties: {
        site_redirect: 'WALLET'
      }
    })
  }

  render() {
    const { kycReset, metadataRestore, previousStep, restoringR } = this.props
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
  metadataRestore: selectors.signup.getMetadataRestore(state) as any,
  restoringR: selectors.signup.getRestoring(state) as any
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector> &
  OwnProps & {
    previousStep: () => void
  }

export default connect(mapStateToProps, mapDispatchToProps)(RecoverContainer)
