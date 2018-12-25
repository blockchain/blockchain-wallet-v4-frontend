import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, model } from 'data'
import { getData } from './selectors'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'

import LowFlow from './template.lowflow'
import HighFlow from './template.highflow'
import Loading from './template.loading'

const { FLOW_TYPES, KYC_PROVIDERS } = model.components.identityVerification

class VerifyContainer extends React.PureComponent {
  state = {
    showVeriff: false
  }

  componentDidMount () {
    const { actions } = this.props
    actions.fetchSupportedDocuments()
    actions.checkKycFlow()
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
    const { data, actions, modalActions, ...rest } = this.props

    return data.cata({
      Success: ({ deeplink, docTypes, email, flowConfig }) => {
        const { flowType, kycProvider } = flowConfig
        return (
          <MediaContextConsumer>
            {({ mobile }) =>
              flowType === FLOW_TYPES.HIGH && mobile ? (
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
                  handleSubmit={() => this.showKycProvider(kycProvider)}
                  {...rest}
                />
              )
            }
          </MediaContextConsumer>
        )
      },
      Loading: () => <Loading />,
      NotAsked: () => null,
      Failure: () => null
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
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
