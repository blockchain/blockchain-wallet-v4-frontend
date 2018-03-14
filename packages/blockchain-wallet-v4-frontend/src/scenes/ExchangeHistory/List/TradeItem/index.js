import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { formatTrade } from 'services/ShapeshiftService'
import TradeItem from './template'

class PagesContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
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
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PagesContainer)
