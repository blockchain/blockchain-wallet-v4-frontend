import React from 'react'

import style from './style.scss'

const title = 'Wallet Access via Tor'

const description = (
  <span>
    Enable the following option to prevent IP addresses that are known to be part of the Tor anonymizing network from accessing your wallet.
    The Tor network is frequently used by hackers attempting to access Blockchain users wallets.
  </span>
)

const settings = (
  <div>
    <button className='button-primary'>Block</button>
  </div>
)

export default {
  title, description, settings
}
