import React from 'react'
import { RecurringBuyCheckout } from './template'
import { getData } from './selectors'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'

class CoinifyRecurringBuy extends React.Component {
  componentDidMount () {
    this.props.coinifyActions.coinifyRecurringCheckoutInitialize()
  }
  render () {
    const { frequency, frequencyElements, showRecurring, duration, disableRecurringCheckbox, showModal } = this.props

    return <RecurringBuyCheckout
      frequency={frequency}
      frequencyElements={frequencyElements}
      showRecurring={showRecurring}
      duration={duration}
      disableRecurringCheckbox={disableRecurringCheckbox}
      showModal={showModal}
    />
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinifyRecurringBuy)
