import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, model } from 'data'
import { getData } from './selectors'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'

import LowFlow from './template.lowflow'
import HighFlow from './template.highflow'
import Loading from './template.loading'

const { FLOW_TYPES } = model.components.identityVerification

class VerifyContainer extends React.PureComponent {
  state = {
    showVeriff: false
  }

  componentDidMount () {
    const { actions } = this.props
    actions.fetchSupportedDocuments()
    actions.checkKycFlow()
  }

  showVeriff = () => {
    this.setState({ showVeriff: true })
  }

  render () {
    const { data, actions, modalActions, ...rest } = this.props

    return data.cata({
      Success: ({ docTypes, flowType, email, deeplink }) => (
        <MediaContextConsumer>
          {({ mobile }) =>
            flowType === FLOW_TYPES.LOW && !mobile ? (
              <LowFlow
                supportedDocuments={docTypes}
                showVeriff={this.state.showVeriff}
                handleSubmit={this.showVeriff}
              />
            ) : (
              <HighFlow
                email={email}
                deeplink={deeplink}
                send={actions.sendDeeplink}
                done={modalActions.closeAllModals}
                {...rest}
              />
            )
          }
        </MediaContextConsumer>
      ),
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
