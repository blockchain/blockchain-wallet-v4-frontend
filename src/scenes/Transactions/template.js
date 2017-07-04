import React from 'react'

import MenuTop from './MenuTop'
import TransactionList from './TransactionList'

const Transactions = (props) => {
  return (
    <div>
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

export default Transactions
