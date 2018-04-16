import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { not, path, prop } from 'ramda'

import { actions } from 'data'
import { formatTrade } from 'services/ShapeshiftService'
import TradeItem from './template'

class PagesContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount () {
    // console.log('TRADE', this.props.trade)
    if (path(['trade', 'quote'], this.props) && not(prop('depositAmount', this.props.trade.quote)) && prop('deposit', this.props.trade.quote)) {
      this.props.shapeshiftHistoryActions.fetchTradeDetails(this.props.trade)
    }
  }

  handleClick () {
    this.props.modalActions.showModal('ExchangeDetails', { trade: this.props.trade })
  }

  render () {
    return <TradeItem trade={this.props.trade} handleClick={this.handleClick} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  trade: formatTrade(ownProps.trade)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  shapeshiftHistoryActions: bindActionCreators(actions.modules.shapeshiftHistory, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PagesContainer)
