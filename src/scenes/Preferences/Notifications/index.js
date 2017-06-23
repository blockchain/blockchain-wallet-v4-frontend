import React from 'react'
import { FormattedText } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='d-flex h6 padding-bottom-10 text-capitalize'>
      <FormattedText id='scenes.preferences.notifications.title' defaultMessage='Notifications' />
    </div>
    <div className='d-flex'>
      <FormattedText id='scenes.preferences.notifications.description' defaultMessage='Get notified when you receive bitcoin.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    [Notification Configuration]
  </div>
)

export default {
  description, settings
}
