import React from 'react'
import CSSModules from 'react-css-modules'

import Dropdown from 'components/Shared/Dropdown'
import FilterStatus from './FilterStatus'
import Search from './Search'
import style from './style.scss'

const MenuTop = (props) => {
  console.log(props)
  return (
    <div className='container-fluid' styleName='menuTop'>
      <div className='row'>
        <div className='col-md-4'>
          <Dropdown items={props.addresses} callback={props.changeAddress} selected={props.selectedAddress} />
        </div>
        <div className='col-md-4'>
          <FilterStatus />
        </div>
        <div className='col-md-4'>
          <Search />
        </div>
      </div>
    </div>
  )
}

export default CSSModules(MenuTop, style)
