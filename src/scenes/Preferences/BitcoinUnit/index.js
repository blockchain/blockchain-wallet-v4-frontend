import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'

const title = 'Bitcoin Unit'

const description = (
  <span className={typography.h4}>
    Adjust the precision you would prefer bitcoin values to be displayed in.
  </span>
)

const settings = (
  <div>
    [Bitcoin Unit]
  </div>
)

export default {
  title, description, settings
}
