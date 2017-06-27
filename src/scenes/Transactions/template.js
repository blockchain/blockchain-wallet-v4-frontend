import React from 'react'
import CSSModules from 'react-css-modules'

import MenuTop from './MenuTop'
import TransactionList from './TransactionList'

import style from './style.scss'

const Transactions = (props) => {
  return (
    <div styleName='transactions'>
      <MenuTop
        addressFilter={props.addressFilter}
        selectAddress={props.selectAddress}
        addresses={props.addresses}
        typeFilter={props.typeFilter}
        selectType={props.selectType}
        types={props.types}
        searchFilter={props.searchFilter}
        selectSearch={props.selectSearch}
      />
      <TransactionList />
    </div>
  )
}

export default CSSModules(Transactions, style)
