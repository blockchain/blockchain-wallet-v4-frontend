import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getData } from './selectors'
import SfoxSignupBanner from './template.js'
import { determineStep } from 'services/SfoxService'
import { actions } from 'data'

class SfoxSignupBannerContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { step: null }
    this.renderStepper = this.renderStepper.bind(this)
    this.goToBuySell = this.goToBuySell.bind(this)
  }

  goToBuySell () {
    this.props.history.push('/buy-sell')
    this.props.modalActions.showModal('SfoxExchangeData', { step: this.state.step })
  }

  renderStepper (sfoxData) {
    const step = determineStep(sfoxData.sfoxProfile, sfoxData.verificationStatus, sfoxData.sfoxAccounts)
    let currentStep = 0
    this.setState({ step: step })

    switch (step) {
      case 'account':
        currentStep = 1
        break
      case 'verify':
        currentStep = 2
        break
      case 'upload':
        currentStep = 3
        break
      case 'funding':
        currentStep = 4
        break
      default: {
        break
      }
    }

    return currentStep > 0
      ? (<SfoxSignupBanner currentStep={currentStep - 1} goToBuySell={this.goToBuySell}/>)
      : null
  }

  render () {
    const { data } = this.props

    if (data.cata) {
      return data.cata({
        Success: (sfoxData) => this.renderStepper(sfoxData),
        Failure: () => <div/>,
        Loading: () => <div/>,
        NotAsked: () => <div/>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SfoxSignupBannerContainer))
