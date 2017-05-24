import React from 'react'
import './style.scss'

import Ticker from './Ticker'
import WhatsNew from './WhatsNew'

const Header = () => {
  return (
    <nav className='header'>
      Header
      <Ticker />
      <WhatsNew />
    </nav>
  )
}

export default Header
