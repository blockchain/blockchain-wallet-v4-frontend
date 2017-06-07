import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const TransactionListItem = () => {
  return (
    <div styleName='transaction-list-item'>
      Transaction List Item
    </div>
  )
}

export default CSSModules(TransactionListItem, style)
