import React from 'react'
import Transactions from './template.js'

class TransactionsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedAddress: 'all'
    }
    this.changeAddress = this.changeAddress.bind(this)
    this.addresses = [
      { text: 'All Wallets', value: 'all' }
    ]
  }

  changeAddress (value) {
    this.setState({selectedAddress: value})
    console.log('changeAddress :' + value)
  }

  render () {
    return (
      <Transactions
        selectedAddress={this.state.selectedAddress}
        changeAddress={this.changeAddress}
        addresses={this.addresses}
      />
    )
  }
}

export default TransactionsContainer
