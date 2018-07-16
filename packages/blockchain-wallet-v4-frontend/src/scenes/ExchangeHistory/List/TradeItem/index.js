import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import TradeItem from './template'

class PagesContainer extends React.PureComponent {
  render () {
    const { status, date, sourceCoin, targetCoin, deposit, depositAmount, withdrawalAmount, modalActions } = this.props

    return <TradeItem
      status={status}
      date={date}
      sourceCoin={sourceCoin}
      targetCoin={targetCoin}
      deposit={deposit}
      depositAmount={depositAmount}
      withdrawalAmount={withdrawalAmount}
      handleClick={() => modalActions.showModal('ExchangeDetails', { depositAddress: deposit })}
    />
  }
}

const mapStateToProps = (state, ownProps) => getData(ownProps.trade, state)

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PagesContainer)
