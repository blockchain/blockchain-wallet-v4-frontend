import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions, model } from 'data'
import { checkHasWebcam } from 'utils/helpers'
import { getData, getPreIdvData } from './selectors'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'
import DataError from 'components/DataError'
import SiftScience from 'components/SiftScience'

import HighFlow from './template.highflow'
import Loading from './template.loading'
import LowFlow from './template.lowflow'

const { FLOW_TYPES, KYC_PROVIDERS } = model.components.identityVerification

class VerifyContainer extends React.PureComponent {
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
      case KYC_PROVIDERS.ONFIDO:
        this.props.modalActions.showModal(
          'Onfido',
          {
            position: this.props.position + 1,
            total: this.props.total + 1
          },
          {}
        )
        break
      default:
        this.setState({ showVeriff: true })
    }
  }

  render () {
    const {
      actions,
      data,
      modalActions,
      onClose,
      preIdvData,
      ...rest
    } = this.props

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
                  onClose={onClose}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyContainer)
