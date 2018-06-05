import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { path } from 'ramda'

import { actions } from 'data'
import { determineStep } from 'services/SfoxService'
import { getData } from './selectors'
import BuySellStepper from './template.js'

class BuySellStepperContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.renderStepper = this.renderStepper.bind(this)
    this.goToBuySell = this.goToBuySell.bind(this)
  }

  componentDidMount () {
    //this.props.sfoxActions.fetchProfile()
    //this.props.sfoxActions.sfoxFetchAccounts()
  }

  goToBuySell () {
    this.props.history.push('/buy-sell')
  }

  renderStepper (data) {
    let currentStep = 0
    console.info(data)

    if (path(['value', 'sfox', 'account_token'], data.bsMetadata)) {
      console.info('account_token found')
      currentStep = 0 // ????
    } else {
      const step = determineStep(data.profile, data.vStatus.level, data.accounts)
      console.info(step)
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
      ? (<BuySellStepper currentStep={currentStep} goToBuySell={this.goToBuySell}/>)
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

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  sfoxActions: bindActionCreators(actions.modules.sfox, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BuySellStepperContainer))
