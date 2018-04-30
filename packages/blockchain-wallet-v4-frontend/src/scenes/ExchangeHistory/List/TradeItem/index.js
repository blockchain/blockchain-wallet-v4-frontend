import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import TradeItem from './template'

class PagesContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    const { deposit } = this.props.trade
    // this.props.modalActions.showModal('ExchangeDetails', { depositAddress: deposit })
  }

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
