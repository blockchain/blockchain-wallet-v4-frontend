import React from 'react'

import MenuTop from './MenuTop'

import style from './style.scss'

const TransactionList = () => {
  return (
    <section className={style.transactionList}>
      <MenuTop />
      <div className={style.transactions} />
    </section>
  )
}

export default TransactionList
