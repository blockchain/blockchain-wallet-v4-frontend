import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'

const title = 'Local Currency'

const description = (
  <span className={typography.h4}>
    Select your local currency.
  </span>
)

const settings = (
  <div>
    [Currency Dropdown]
  </div>
)

export default {
  title, description, settings
}
