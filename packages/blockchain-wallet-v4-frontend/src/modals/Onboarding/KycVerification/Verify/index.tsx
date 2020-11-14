import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React from 'react'

import { actions, model } from 'data'
import { checkHasWebcam } from 'utils/helpers'
import { getData, getPreIdvData } from './selectors'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'
import DataError from 'components/DataError'
import SiftScience from 'components/SiftScience'

import { ExtractSuccess } from 'core/types'
import HighFlow from './template.highflow'
import Loading from './template.loading'
import LowFlow from './template.lowflow'

const { FLOW_TYPES, KYC_PROVIDERS } = model.components.identityVerification

class VerifyContainer extends React.PureComponent<Props> {
  state = {
    hasWebcam: false,
    showVeriff: false
  }

  componentDidMount () {
    const { actions } = this.props
    actions.fetchSupportedDocuments()
    actions.checkKycFlow()
    checkHasWebcam().then(res => {
      this.setState({ hasWebcam: res })
    })
  }

  hideKycProvider = () => {
    this.setState({ showVeriff: false })
  }

  showKycProvider = kycProvider => {
    switch (kycProvider) {
      case KYC_PROVIDERS.VERIFF:
        this.setState({ showVeriff: true })
        break
      default:
        this.setState({ showVeriff: true })
    }
  }

  render () {
    const { actions, data, modalActions, preIdvData, ...rest } = this.props

    const VerificationFlow = data.cata({
      Success: ({
        deeplink,
        docTypes,
        email,
        flowConfig,
        needsDocResubmit
      }) => {
        const { flowType, kycProvider } = flowConfig
        return (
          <MediaContextConsumer>
            {({ mobile }) =>
              (flowType === FLOW_TYPES.HIGH && mobile) ||
              !this.state.hasWebcam ? (
                // @ts-ignore
                <HighFlow
                  email={email}
                  deeplink={deeplink}
                  send={actions.sendDeeplink}
                  done={modalActions.closeAllModals}
                  {...rest}
                />
              ) : (
                <LowFlow
                  supportedDocuments={docTypes}
                  showVeriff={this.state.showVeriff}
                  hideKycProvider={this.hideKycProvider}
                  handleSubmit={() => this.showKycProvider(kycProvider)}
                  needsDocResubmit={needsDocResubmit}
                  {...rest}
                />
              )
            }
          </MediaContextConsumer>
        )
      },
      Loading: () => <Loading />,
      NotAsked: () => null,
      Failure: message => <DataError message={message} />
    })

    const PreIdvCheck = preIdvData.cata({
      Success: val => (
        <SiftScience {...val} onDone={actions.preIdvCheckFinished} />
      ),
      Loading: () => null,
      NotAsked: () => null,
      Failure: () => null
    })

    return (
      <React.Fragment>
        {VerificationFlow}
        {PreIdvCheck}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  preIdvData: getPreIdvData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>

export type Props = ConnectedProps<typeof connector> & {
  onBack: () => void
  onClose: () => void
}

export default connector(VerifyContainer) as React.ComponentType<{
  onBack: () => void
  onClose: () => void
}>
