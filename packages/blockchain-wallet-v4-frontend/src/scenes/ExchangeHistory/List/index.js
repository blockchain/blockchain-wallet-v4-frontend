import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import ui from 'redux-ui'
import { assoc, head, map, repeat, slice } from 'ramda'
import moment from 'moment'

import { actions } from 'data'
import List from './template.js'

class ListContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleClickPage = this.handleClickPage.bind(this)
  }

  handleClick (trade) {
    this.props.modalActions.showModal('ExchangeDetails', { trade })
  }

  handleClickPage (value) {
    this.props.updateUI({ page: value })
  }

  render () {
    const trades = map(x => assoc('date', moment(x.date).format('DD MMMM YYYY, HH:mm'), x), this.props.trades)
    // const temp = map(x => assoc('date', moment(x.date).format('DD MMMM YYYY, HH:mm'), x), this.props.trades)
    // const trades = repeat(head(temp), 105)
    const pageSize = 10
    const pageTotal = Math.trunc((trades.length / pageSize)) + 1
    const pageNumber = this.props.ui.page
    const paginatedTrades = slice((pageNumber - 1) * pageSize, pageNumber * pageSize, trades)

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

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  ui({ state: { page: 1 } }),
  connect(undefined, mapDispatchToProps)
)

export default enhance(ListContainer)
