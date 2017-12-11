import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import ui from 'redux-ui'
import { equals } from 'ramda'

import { actions, selectors } from 'data'
import List from './template.js'

class ListContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleClickPage = this.handleClickPage.bind(this)
  }

  componentWillMount () {
    this.props.exchangeHistoryActions.initExchangeHistory(1)
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.ui.page, nextProps.ui.page)) {
      this.props.exchangeHistoryActions.initExchangeHistory(nextProps.ui.page)
    }
  }

  handleClick (address) {
    this.props.modalActions.showModal('ExchangeDetails', { address })
  }

  handleClickPage (value) {
    this.props.updateUI({ page: value })
  }

  render () {
    const { trades, tradesTotal } = this.props

    const pageSize = 10
    const pageTotal = Math.trunc((tradesTotal / pageSize)) + 1
    const pageNumber = this.props.ui.page

    return <List
      trades={trades}
      pageNumber={pageNumber}
      pageSize={pageSize}
      pageTotal={pageTotal}
      handleClick={this.handleClick}
      handleClickPage={this.handleClickPage}
     />
  }
}

const mapStateToProps = state => ({
  exchangeHistory: selectors.modules.exchangeHistory.getExchangeHistory(state),
  tradesTotal: selectors.modules.exchangeHistory.getTradesTotal(state)
})

const mapDispatchToProps = dispatch => ({
  exchangeHistoryActions: bindActionCreators(actions.modules.exchangeHistory, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  ui({ state: { page: 1 } }),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(ListContainer)
