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
    const { frequency, frequencyElements, showRecurring, duration, disableRecurringCheckbox, showModal, canTrade, level } = this.props

    return <RecurringBuyCheckout
      canTrade={canTrade}
      frequency={frequency}
      frequencyElements={frequencyElements}
      disableRecurringCheckbox={disableRecurringCheckbox}
      duration={duration}
      level={level}
      showModal={showModal}
      showRecurring={showRecurring}
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
