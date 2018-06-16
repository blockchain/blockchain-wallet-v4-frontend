import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { getData } from './selectors'
import SfoxSignupBanner from './template.js'
import { determineStep } from 'services/SfoxService'

class SfoxSignupBannerContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.renderStepper = this.renderStepper.bind(this)
    this.goToBuySell = this.goToBuySell.bind(this)
  }

  goToBuySell () {
    this.props.history.push('/buy-sell')
  }

  renderStepper (sfoxData) {
    const step = determineStep(sfoxData.sfoxProfile, sfoxData.verificationStatus, sfoxData.sfoxAccounts)
    let currentStep = 0

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

const mapStateToProps = (state) => ({
  data: getData(state)
})

export default withRouter(connect(mapStateToProps)(SfoxSignupBannerContainer))
