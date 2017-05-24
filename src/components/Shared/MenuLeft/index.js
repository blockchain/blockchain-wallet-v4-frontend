import React from 'react'
import './style.scss'

import Adverts from './Adverts'
import StepBar from './StepBar'

const MenuLeft = () => {
  return (
    <div className='menu-left'>
      Menu
      <Adverts />
      <StepBar />
    </div>
  )
}

export default MenuLeft
