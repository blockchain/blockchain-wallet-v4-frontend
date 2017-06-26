import React from 'react'
import CSSModules from 'react-css-modules'

import MenuTop from './MenuTop'
import TransactionList from './TransactionList'

import style from './style.scss'

const Transactions = (props) => {
  return (
    <div>
      <MenuTop {...props} />
      <TransactionList />
    </div>
  )
}

export default CSSModules(Transactions, style)
