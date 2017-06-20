import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const ClipboardNextAddress = () => {
  return (
    <button className='button-empty right'>
      <i />
    </button>
  )
}

export default CSSModules(ClipboardNextAddress, style)
