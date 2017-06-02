import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'
import button from 'sass/elements/button.scss'

const title = 'IP Whitelist'

const description = (
  <span className={typography.h4}>
    Allow login without email authentication from the following list of comma-separated IP addresses. Use % as a wildcard.
  </span>
)

const settings = (
  <div>
    <button className={button.primary}>Change</button>
  </div>
)

export default {
  title, description, settings
}
