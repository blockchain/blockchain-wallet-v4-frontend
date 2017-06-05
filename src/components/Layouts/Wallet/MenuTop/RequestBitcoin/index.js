import React from 'react'

import style from './style.scss'
import button from 'sass/elements/button.scss'
import fonts from 'sass/utilities/fonts.scss'

const RequestBitcoin = () => {
  return (
    <button className={button.blank}>
      <i className={fonts.iconReceive} />
      <span>Receive</span>
    </button>
  )
}

export default RequestBitcoin
