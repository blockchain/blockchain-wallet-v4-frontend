import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { determineStep } from 'services/SfoxService'
import { getData } from './selectors'
import SfoxSignupBanner from './template.js'

class SfoxSignupBannerContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.renderStepper = this.renderStepper.bind(this)
    this.goToBuySell = this.goToBuySell.bind(this)
  }

  componentWillMount () {
    this.props.sfoxDataActions.fetchProfile()
    this.props.sfoxDataActions.sfoxFetchAccounts()
  }

  goToBuySell () {
    this.props.history.push('/buy-sell')
  }

  renderStepper (data) {
    let currentStep = 0

    if (data.canTrade === 'sfox') {
      const step = determineStep(data.profile, data.vStatus, data.accounts)
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
    }

    return currentStep > 0
      ? (<SfoxSignupBanner currentStep={currentStep - 1} goToBuySell={this.goToBuySell}/>)
      : null
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => this.renderStepper(value),
      Failure: () => <div/>,
      Loading: () => <div/>,
      NotAsked: () => <div/>
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})
const mapDispatchToProps = dispatch => ({
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SfoxSignupBannerContainer))
