import React from 'react'
import styled from 'styled-components'

import MenuTop from './MenuTop'
import List from './List'

const Wrapper = styled.div`
  width: 100%;
`

const Transactions = (props) => {
  return (
    <Wrapper>
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
      <List />
    </Wrapper>
  )
}

export default Transactions
