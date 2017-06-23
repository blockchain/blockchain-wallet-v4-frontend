import React from 'react'
import { FormattedText } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='d-flex h6 padding-bottom-10 text-capitalize'>
      <FormattedText id='scenes.preferences.autologout.title' defaultMessage='Auto logout' />
    </div>
    <div className='d-flex'>
      <FormattedText id='scenes.preferences.autologout.description' defaultMessage='After a certain period of inactivity,
      you will be automatically logged out of your wallet.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <span className='d-flex h6'>10 minutes</span>
    <button className='d-flex button-secondary'>
      <FormattedText id='scenes.preferences.autologout.change' defaultMessage='Change' />
    </button>
  </div>
)

export default {
  description, settings
}
