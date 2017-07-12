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

  @media(min-width: 992px) { flex-direction: row; }
`
const Filter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 5px;
`
const FilterAddresses = styled(Filter)`
  flex-grow: 1;
  order: 2; 
  @media(min-width: 992px) { order: 1; } 
`
const FilterStatuses = styled(Filter)`
  flex-grow: 2;
  order: 1; 
  @media(min-width: 992px) { order: 2; } 
`
const FilterSearch = styled(Filter)`
  flex-grow: 1;
  order: 3;
  @media(min-width: 992px) { order: 3; } 
`

const MenuTop = (props) => {
  return (
    <Wrapper>
      <FilterAddresses>
        <DropdownSearch items={props.addresses} callback={props.selectAddress} selected={props.addressFilter} />
      </FilterAddresses>
      <FilterStatuses>
        <Status items={props.types} selected={props.typeFilter} callback={props.selectType} />
      </FilterStatuses>
      <FilterSearch>
        <Search selected={props.searchFilter} callback={props.selectSearch} />
      </FilterSearch>
    </Wrapper>
  )
}

export default MenuTop
