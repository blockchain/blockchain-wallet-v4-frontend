import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const NewToBitcoin = () => {
  return (
    <section className='new-to-bitcoin'>
      New to Bitcoin section
    </section>
  )
}

export default CSSModules(NewToBitcoin, style)
