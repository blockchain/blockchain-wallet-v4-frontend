import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='h6'>
      <FormattedMessage id='scenes.preferences.notifications.title' defaultMessage='Notifications' />
    </div>
    <div>
      <FormattedMessage id='scenes.preferences.notifications.description' defaultMessage='Get notified when you receive bitcoin.' />
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
