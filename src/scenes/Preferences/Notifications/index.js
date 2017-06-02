import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'

const title = 'Notifications'

const description = (
  <span className={typography.h4}>
    Get notified when you receive bitcoin.
  </span>
)

const settings = (
  <div>
    [Notifications configuration]
  </div>
)

export default {
  title, description, settings
}
