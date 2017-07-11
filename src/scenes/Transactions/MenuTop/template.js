import React from 'react'
import styled from 'styled-components'

import DropdownSearch from 'components/shared/DropdownSearch'
import Status from './Status'
import Search from './Search'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 8px 30px;
  box-sizing: border-box;
  background-color: #F5F7F9;
  border-bottom: 1px solid #DDDDDD;

  @media(min-width: 1200px) { flex-direction: row; }
`
const Filter = styled.div`
  width: 100%;

  @media(min-width: 960px) { width: 50%; }
  @media(min-width: 1200px) { width: 33%; }
`

const MenuTop = (props) => {
  return (
    <Wrapper>
      <Filter>
        <DropdownSearch items={props.addresses} callback={props.selectAddress} selected={props.addressFilter} />
      </Filter>
      <Filter>
        <Status items={props.types} selected={props.typeFilter} callback={props.selectType} />
      </Filter>
      <Filter>
        <Search selected={props.searchFilter} callback={props.selectSearch} />
      </Filter>
    </Wrapper>
  )
}

export default MenuTop
