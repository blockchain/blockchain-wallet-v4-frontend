import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { map, assoc } from 'ramda'
import moment from 'moment'

import { actions } from 'data'
import List from './template.js'

class ListContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (trade) {
    this.props.modalActions.showModal('ExchangeDetails', { trade })
  }

  render () {
    const trades = map(x => assoc('date', moment(x.date).format('DD MMMM YYYY, HH:mm'), x), this.props.trades)
    console.log(trades)
    return <List trades={trades} handleClick={this.handleClick} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(undefined, mapDispatchToProps)(ListContainer)
