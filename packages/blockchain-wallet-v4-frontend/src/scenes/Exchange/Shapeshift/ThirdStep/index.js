
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'data'
import { getData } from './selectors'
import ThirdStep from './template'

class ThirdStepContainer extends React.Component {
  render () {
    const { sourceCoin, targetCoin, sourceAmount, status, exchangeRate, transactionFee, orderId, depositAmount, withdrawalAmount, handleClose } = this.props

    return (
      <ThirdStep
        sourceCoin={sourceCoin}
        targetCoin={targetCoin}
        sourceAmount={sourceAmount}
        status={status}
        exchangeRate={exchangeRate}
        transactionFee={transactionFee}
        orderId={orderId}
        depositAmount={depositAmount}
        withdrawalAmount={withdrawalAmount}
        handleClose={() => this.props.actions.thirdStepCloseClicked()}
      />
    )
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ThirdStepContainer)
