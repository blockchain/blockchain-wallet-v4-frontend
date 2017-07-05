import React from 'react'
import styled from 'styled-components'

import DropdownSearch from 'components/Shared/DropdownSearch'
import FilterStatus from './FilterStatus'
import Search from './Search'

const MenuTopWrapper = styled.div`
  width: 100%;
  height: 55px;
  padding: 8px 30px;
  @include box-sizing(border-box);
  background-color: $gray-lightest;
  border-bottom: 1px solid $gray-lighter;
`

const MenuTop = (props) => {
  return (
    <MenuTopWrapper>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-4'>
            <DropdownSearch items={props.addresses} callback={props.selectAddress} selected={props.addressFilter} />
          </div>
          <div className='col-md-4'>
            <FilterStatus items={props.types} selected={props.typeFilter} callback={props.selectType} />
          </div>
          <div className='col-md-4'>
            <Search selected={props.searchFilter} callback={props.selectSearch} />
          </div>
        </div>
      </div>
    </MenuTopWrapper>
  )
}

export default MenuTop
