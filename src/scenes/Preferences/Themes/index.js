import React from 'react'

import style from './style.scss'

const title = 'Auto Logout'

const description = (
  <span>
    After a certain period of inactivity, you will be automatically logged out of your wallet.
  </span>
)

const settings = (
  <div>
    <span>
      10min
    </span>
    <button className='primary'>Change</button>
  </div>
)

export default {
  title, description, settings
}
