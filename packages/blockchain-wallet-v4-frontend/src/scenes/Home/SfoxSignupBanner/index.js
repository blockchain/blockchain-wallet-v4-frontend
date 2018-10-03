import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData } from './selectors'
import SfoxSignupBanner from './template.js'
import { determineStep } from 'services/SfoxService'
import { actions } from 'data'
import { path } from 'ramda'

class SfoxSignupBannerContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { step: null }
    this.renderStepper = this.renderStepper.bind(this)
    this.goToBuySell = this.goToBuySell.bind(this)
  }

  goToBuySell () {
    this.props.history.push('/buy-sell')
    this.props.modalActions.showModal('SfoxExchangeData', {
      step: this.state.step
    })
  }

  renderStepper (sfoxData) {
    const jumioId = path(['sfoxKvData', 'jumio', 'id'], this.props)
    const jumioStatus = path(['sfoxKvData', 'jumio', 'completed'], this.props)
    const step = determineStep(
      sfoxData.sfoxProfile,
      sfoxData.verificationStatus,
      sfoxData.sfoxAccounts,
      jumioId,
      jumioStatus
    )
    const steps = { account: 1, verify: 2, upload: 3, funding: 4 }
    const currentStep = steps[step] || 0

    this.setState({ step: step })

    return currentStep > 0 ? (
      <SfoxSignupBanner
        currentStep={currentStep - 1}
        goToBuySell={this.goToBuySell}
      />
    ) : null
  }

  render () {
    const { data } = this.props

    if (data.cata) {
      return data.cata({
        Success: sfoxData => this.renderStepper(sfoxData),
        Failure: () => <div />,
        Loading: () => <div />,
        NotAsked: () => <div />
      })
    } else {
      return null
    }
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SfoxSignupBannerContainer)
)
