import React from 'react'
import CSSModules from 'react-css-modules'

import Adverts from './Adverts'
import Footer from './Footer'
import Navigation from './Navigation'

import style from './style.scss'

const MenuLeft = (props) => {
  return (
    <div styleName='menu-left'>
      <Navigation location={props.location} />
      <Adverts />
      <Footer />
    </div>
  )
}

export default CSSModules(MenuLeft, style)
