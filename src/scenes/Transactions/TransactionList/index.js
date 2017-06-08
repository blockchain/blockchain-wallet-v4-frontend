import React from 'react'
import CSSModules from 'react-css-modules'

import TransactionListItemContainer from './TransactionListItem'

import style from './style.scss'

const TransactionList = (props) => {
  return (
    <div styleName='transactions-list'>
      {props.transactions.map(function (transaction, index) {
        return <TransactionListItemContainer key={index} transaction={transaction} />
      })}
    </div>
  )
}

export default CSSModules(TransactionList, style)
