import React from 'react'

import style from './style.scss'

const title = 'Pairing code'

const description = (
  <span>
    Scan the code <i>(click on 'Show Pairing Code')</i> with your Blockchain Wallet (iOS or Android) for a seamless connection to your wallet.
    Download the <a>iOS app here</a> and the <a>Android app here</a>.
    <span>Do not share your Pairing Code with others.</span>
  </span>
)

const settings = (
  <button className='button-primary'>Show Pairing Code</button>
)

export default {
  title, description, settings
}
