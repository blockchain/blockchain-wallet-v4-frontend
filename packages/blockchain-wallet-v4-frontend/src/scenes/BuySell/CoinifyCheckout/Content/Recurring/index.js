import React from 'react'
import { RecurringBuyCheckout } from './template'
import { getData } from './selectors'
import { connect } from 'react-redux'

class CoinifyRecurringBuy extends React.Component {
  render () {
    const { frequency, frequencyElements, showRecurring } = this.props

    return <RecurringBuyCheckout
      frequency={frequency}
      frequencyElements={frequencyElements}
      showRecurring={showRecurring}
    />
  }
}

const mapStateToProps = state => getData(state)

// const mapDispatchToProps = dispatch => ({
//   modalActions: bindActionCreators(actions.modals, dispatch),
//   coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
//   formActions: bindActionCreators(actions.form, dispatch),
//   coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
// })

export default connect(
  mapStateToProps,
  null
)(CoinifyRecurringBuy)
