import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='h6'>
      <FormattedMessage id='scenes.settings.2faremember.title' defaultMessage='Remember 2-step Verification' />
    </div>
    <div className='flex-row'>
      <FormattedMessage id='scenes.settings.2faremember.description' defaultMessage='Your browser will be remembered for a short period of time, allowing you to login again without having to re-authenticate.' />
      <FormattedMessage id='scenes.settings.2faremember.description2' defaultMessage='Disable this to require full authentication every time you login. This will not affect your current browser until you delete all cookies.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='button-secondary'>
      <FormattedMessage id='scenes.settings.2faremember.enable' defaultMessage='Enable' />
    </button>
  </div>
)

export default {
  description, settings
}
