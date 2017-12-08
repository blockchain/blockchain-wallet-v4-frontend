import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import ui from 'redux-ui'
import { equals, map, slice, path, prop } from 'ramda'
import moment from 'moment'

import { actions, selectors } from 'data'
import List from './template.js'

class ListContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleClickPage = this.handleClickPage.bind(this)
    this.transformTrade = this.transformTrade.bind(this)
  }

  componentWillMount () {
    const depositAddresses = map(t => path(['quote', 'deposit'], t), this.props.trades)
    this.props.exchangeHistoryActions.initExchangeHistory(depositAddresses)
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.ui.page, nextProps.ui.page)) {
      const depositAddresses = map(t => path(['quote', 'deposit'], t), nextProps.trades)
      this.props.exchangeHistoryActions.initExchangeHistory(depositAddresses)
    }
  }

  handleClick (address) {
    this.props.modalActions.showModal('ExchangeDetails', { address })
  }

  handleClickPage (value) {
    this.props.updateUI({ page: value })
  }

  transformTrade (trade) {
    const { tradesStatus } = this.props
    const address = path(['quote', 'deposit'], trade)
    const status = prop(address, tradesStatus)
    return {
      address,
      date: moment(prop('timestamp', trade)).format('DD MMMM YYYY, HH:mm'),
      status: prop('status', trade),
      incomingCoin: prop('incomingCoin', status),
      incomingType: prop('incomingType', status),
      outgoingCoin: prop('outgoingCoin', status),
      outgoingType: prop('outgoingType', status)
    }
  }

  render () {
    const { trades } = this.props
    const finalTrades = map(this.transformTrade, trades)

    const pageSize = 10
    const pageTotal = Math.trunc((trades.length / pageSize)) + 1
    const pageNumber = this.props.ui.page
    const paginatedTrades = slice((pageNumber - 1) * pageSize, pageNumber * pageSize, finalTrades)

    return <List
      trades={paginatedTrades}
      pageNumber={pageNumber}
      pageSize={pageSize}
      pageTotal={pageTotal}
      handleClick={this.handleClick}
      handleClickPage={this.handleClickPage}
     />
  }
}

const mapStateToProps = state => ({
  exchangeHistory: selectors.components.exchangeHistory.getExchangeHistory(state)
})

const mapDispatchToProps = dispatch => ({
  exchangeHistoryActions: bindActionCreators(actions.components.exchangeHistory, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  ui({ state: { page: 1 } }),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(ListContainer)
