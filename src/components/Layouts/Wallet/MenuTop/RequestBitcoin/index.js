import React from 'react'
import classNames from 'classnames'

import style from './style.scss'
import button from 'sass/elements/button.scss'
import fonts from 'sass/utilities/fonts.scss'
import typography from 'sass/utilities/typography.scss'

const RequestBitcoin = () => {
  return (
    <button className={button.blankLeft}>
      <i className={classNames(fonts.iconReceive, typography.marginRight5)} />
      Receive
    </button>
  )
}

export default RequestBitcoin
