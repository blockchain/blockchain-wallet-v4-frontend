import React from 'react'

import Adverts from './Adverts'
import Footer from './Footer'
import Navigation from './Navigation'

const MenuLeft = (props) => {
  return (
    <div>
      <Navigation location={props.location} />
      <Adverts />
      <Footer />
    </div>
  )
}

export default MenuLeft
