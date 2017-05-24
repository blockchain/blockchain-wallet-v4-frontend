import React from 'react'
import './style.scss'

import TransactionList from './TransactionList'
import GenerateReport from './GenerateReport'

const Transactions = () => {
  return (
    <section className='transactions'>
      <h1>Transactions</h1>
      <TransactionList />
      <GenerateReport />
    </section>
  )
}

export default Transactions
