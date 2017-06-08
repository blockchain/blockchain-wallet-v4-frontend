import React from 'react'
import CSSModules from 'react-css-modules'

import MenuTop from './MenuTop'
import TransactionList from './TransactionList'

import style from './style.scss'

const Transactions = (props) => {
  return (
    <section className='container-fluid'>
      <div className='row'>
        <div className='col-md-12'>
          <MenuTop />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-12'>
          <TransactionList transactions={props.transactions} />
        </div>
      </div>
    </section>
  )
}

export default CSSModules(Transactions, style)
