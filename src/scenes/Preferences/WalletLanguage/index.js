import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'

const title = 'Wallet Language'

const description = (
  <span className={typography.h4}>
    Set your preferred language.
  </span>
)

const settings = (
  <div>
    [Language Dropdown]
  </div>
)

export default {
  title, description, settings
}
