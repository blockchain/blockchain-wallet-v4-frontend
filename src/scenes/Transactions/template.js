import React from 'react'
import CSSModules from 'react-css-modules'

import TransactionList from './TransactionList'

import style from './style.scss'

const Transactions = () => {
  return (
    <section>
      <TransactionList />
    </section>
  )
}

export default CSSModules(Transactions, style)
