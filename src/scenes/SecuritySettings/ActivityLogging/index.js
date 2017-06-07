import React from 'react'

import style from './style.scss'

const title = 'Activity Logging'

const description = (
  <span>
    Record wallet activity and display it in your activity feed.
  </span>
)

const settings = (
  <div>
    <button className='button-primary'>Enable</button>
  </div>
)

export default {
  title, description, settings
}
