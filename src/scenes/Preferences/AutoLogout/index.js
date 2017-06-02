import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'

const title = 'Themes'

const description = (
  <span className={typography.h4}>
    Try out different themes for the wallet.
  </span>
)

const settings = (
  <div>
    [Themes Dropdown]
  </div>
)

export default {
  title, description, settings
}
