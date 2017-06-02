import React from 'react'

import TransactionList from './TransactionList'
import GenerateReport from './GenerateReport'

import style from './style.scss'

const Transactions = () => {
  return (
    <section className={style.transactions}>
      Transactions
      <TransactionList />
      <GenerateReport />
    </section>
  )
}

export default Transactions
