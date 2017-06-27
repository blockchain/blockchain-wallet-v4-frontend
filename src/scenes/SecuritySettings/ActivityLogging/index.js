import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='h6'>
      <FormattedMessage id='scenes.settings.activitylogging.title' defaultMessage='Activity Logging' />
    </div>
    <div>
      <FormattedMessage id='scenes.settings.activitylogging.description' defaultMessage='Record wallet activity and display it in your activity feed.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='button-secondary'>
      <FormattedMessage id='scenes.settings.activitylogging.enable' defaultMessage='Enable' />
    </button>
  </div>
)

export default {
  description, settings
}
