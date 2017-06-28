import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import TransactionListItem from './TransactionListItem'

import style from './style.scss'

const TransactionList = (props) => {
  return (
    <div styleName='transactions-list'>
      {props.transactions.map(function (transaction, index) {
        return <TransactionListItem key={index} transaction={transaction} />
      })}
    </div>
  )
}

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    time: PropTypes.number.isRequired,
    to: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string,
    initial_value: PropTypes.string
  }))
}

export default CSSModules(TransactionList, style)
