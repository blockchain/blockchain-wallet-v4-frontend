import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import { getData } from './selectors'
import * as SfoxService from 'services/SfoxService'
import BuySellStepper from './template.js'

class BuySellStepperContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.goToBuySell = this.goToBuySell.bind(this)
  }

  // componentDidMount () {
  //   this.props.sfoxDataActions.fetchTrades()
  //   this.props.sfoxDataActions.fetchProfile()
  //   this.props.sfoxDataActions.sfoxFetchAccounts()
  // }

  goToBuySell = () => {
    this.props.history.push('/buy-sell')
  }

  render () {
    const { canTrade, data } = this.props
    const partner2 = data.cata({ Success: (val) => val, Loading: () => false, Failure: () => false, NotAsked: () => false })
    const partner = 'sfox'
    console.info(partner2)
    const totalSteps = partner === 'sfox' ? 4 : 2

    if (partner === 'sfox') {
     // console.info(SfoxService.determineStep())
    } else {
     // console.log('coinify')
    }

    return (partner ? <BuySellStepper partner={partner} currentStep={1} totalSteps={totalSteps} goToBuySell={this.goToBuySell} /> : null)
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  sfoxActions: bindActionCreators(actions.modules.sfox, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BuySellStepperContainer))
