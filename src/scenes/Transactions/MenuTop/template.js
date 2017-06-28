import React from 'react'
import CSSModules from 'react-css-modules'

import Dropdown from 'components/Shared/Dropdown'
import FilterStatus from './FilterStatus'
import Search from './Search'
import style from './style.scss'

const MenuTop = (props) => {
  return (
    <div className='container-fluid' styleName='menuTop'>
      <div className='row'>
        <div className='col-md-4'>
          <Dropdown items={props.addresses} callback={props.selectAddress} selected={props.addressFilter} />
        </div>
        <div className='col-md-4'>
          <FilterStatus items={props.types} selected={props.typeFilter} callback={props.selectType} />
        </div>
        <div className='col-md-4'>
          <Search selected={props.searchFilter} callback={props.selectSearch} />
        </div>
      </div>
    </div>
  )
}

export default CSSModules(MenuTop, style)
