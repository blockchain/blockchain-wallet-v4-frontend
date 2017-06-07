import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Addresses = () => {
  return (
    <section styleName='addresses'>
      Addresses page
    </section>
  )
}

export default CSSModules(Addresses, style)
