import React from 'react'

import style from './style.scss'

const title = 'Bitcoin Links Handling'

const description = (
  <span>
    Enable this to allow your Blockchain Wallet to handle bitcoin payment links in the web browser.
    This will make your experience more convenient when transacting online.
  </span>
)

const settings = (
  <div>
    <button className='button-primary'>Change</button>
  </div>
)

export default {
  title, description, settings
}
