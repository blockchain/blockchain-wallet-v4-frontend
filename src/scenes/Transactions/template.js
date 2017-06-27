import React from 'react'
import CSSModules from 'react-css-modules'

import MenuTop from './MenuTop'
import TransactionList from './TransactionList'

import style from './style.scss'

const Transactions = (props) => {
  return (
    <div styleName='transactions'>
      <MenuTop
        onlyShow={props.onlyShow}
        changeAddress={props.changeAddress}
        addresses={props.addresses}
      />
      <TransactionList />
    </div>
  )
}

export default CSSModules(Transactions, style)
