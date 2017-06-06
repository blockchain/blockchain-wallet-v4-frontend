import React from 'react'

import TransactionList from './TransactionList'

import style from './style.scss'

const Transactions = () => {
  return (
    <section className={style.transactions}>
      <TransactionList />
    </section>
  )
}

export default Transactions
