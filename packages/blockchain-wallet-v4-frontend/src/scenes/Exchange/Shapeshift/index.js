import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { equals } from 'ramda'
// import * as crypto from 'crypto'

import wizardProvider from 'providers/WizardProvider'
import { getData } from './selectors'
import { actions } from 'data'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class ShapeshiftContainer extends React.Component {
  componentWillMount () {
    this.props.resetStep()
    if (equals('BTC', this.props.sourceCoin)) { this.props.dataBitcoinActions.fetchFee() }
    if (equals('ETH', this.props.sourceCoin)) { this.props.dataEthereumActions.fetchFee() }
    this.props.formActions.initialize('exchange', this.props.initialValues)
  }

  componentWillReceiveProps (nextProps) {
    // Fetch fee if sourceCoin has changed
    if (!equals(this.props.sourceCoin, nextProps.sourceCoin) && equals('BTC', nextProps.sourceCoin)) {
      // console.log('BTC', this.props.sourceCoin, nextProps.sourceCoin)
      this.props.dataBitcoinActions.fetchFee()
    }
    if (!equals(this.props.sourceCoin, nextProps.sourceCoin) && equals('ETH', nextProps.sourceCoin)) {
      // console.log('ETH', this.props.sourceCoin, nextProps.sourceCoin)
      this.props.dataEthereumActions.fetchFee()
    }
  }

  render () {
    // console.log('ShapeshitContainer render', this.props)
    switch (this.props.step) {
      case 1: return <FirstStep {...this.props} />
      case 2: return <SecondStep {...this.props} />
      default: return <div />
    }
  }
}

const mapStateToProps = state => ({
  ...getData(state)
})

const mapDispatchToProps = dispatch => ({
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  dataEthereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  dataShapeshiftActions: bindActionCreators(actions.core.data.shapeShift, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  wizardProvider('exchange', 2),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(ShapeshiftContainer)
