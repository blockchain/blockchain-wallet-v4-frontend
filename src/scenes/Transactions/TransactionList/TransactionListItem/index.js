import React from 'react'

import TransactionList from './template.js'

class TransactionListContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { detailsDisplayed: false }
  }

  render () {
    let { detailsDisplayed } = this.state
    let handleClickDetails = () => this.setState({ detailsDisplayed: !detailsDisplayed })
    return (
      <TransactionList transaction={this.props.transaction} detailsDisplayed={this.state.detailsDisplayed} clickDetails={handleClickDetails} />
    )
  }
}

export default TransactionListContainer
