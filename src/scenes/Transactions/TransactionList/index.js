import React from 'react'
import CSSModules from 'react-css-modules'

import MenuTop from './MenuTop'

import style from './style.scss'

const TransactionList = () => {
  return (
    <section styleName='transactions-list'>
      <MenuTop />
    </section>
  )
}

export default CSSModules(TransactionList, style)
