import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'
import button from 'sass/elements/button.scss'

const title = 'Pairing code'

const description = (
  <span className={typography.h4}>
    Scan the code <i>(click on 'Show Pairing Code')</i> with your Blockchain Wallet (iOS or Android) for a seamless connection to your wallet.
    Download the <a>iOS app here</a> and the <a>Android app here</a>.
    <span className={typography.alert}>Do not share your Pairing Code with others.</span>
  </span>
)

const settings = (
  <button className={button.primary}>Show Pairing Code</button>
)

export default {
  title, description, settings
}
