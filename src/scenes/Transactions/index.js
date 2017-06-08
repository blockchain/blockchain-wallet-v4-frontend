import React from 'react'
import Transactions from './template.js'

class TransactionsContainer extends React.Component {
  render () {
    let transactions = [{
      id: '1',
      type: 'Received',
      status: 'confirmed',
      time: 'April 26 @ 03:15 PM',
      amount: 0.00199132,
      to: 'My Bitcoin Wallet',
      from: '193k4Up8wmNRTZ9qipcQB3rJM4pwrqV7wP',
      description: 'from sjors, fuck yeah!',
      initial_value: '£2.01'
    }, {
      id: '2',
      type: 'Sent',
      status: 'confirmed',
      time: 'April 30 @ 03:15 PM',
      amount: 0.00109132,
      to: '193k4Up8wmNRTZ9qipcQB3rJM4pwrqV7wP',
      from: 'My Bitcoin Wallet',
      description: 'some sort of test',
      initial_value: '£1.22'
    },{
      id: '3',
      type: 'Sent',
      status: 'confirmed',
      time: 'April 31 @ 02:15 PM',
      amount: 0.00023132,
      to: '193k4Up8wmNRTZ9qipcQB3rJM4pwrqV7wP',
      from: 'My Bitcoin Wallet',
      description: '',
      initial_value: '£1.22'
    }]

    return (
      <Transactions transactions={transactions} />
    )
  }
}

export default TransactionsContainer
