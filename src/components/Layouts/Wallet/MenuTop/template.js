import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'

const MenuTop = () => {
  return (
    <div className={style.menuTop}>
      <span className={typography.h2}>Be your own bank.</span>
    </div>
  )
}

export default MenuTop
