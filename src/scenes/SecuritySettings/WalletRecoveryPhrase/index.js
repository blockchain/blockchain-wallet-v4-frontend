import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'
import button from 'sass/elements/button.scss'
import link from 'sass/elements/link.scss'

const title = 'API Access'

const description = (
  <span className={typography.h4}>
    Use our API to interact with your wallet programtically. Follow the steps <a className={link.default}>here</a> to get started.
  </span>
)

const settings = (<div />)

export default {
  title, description, settings
}
