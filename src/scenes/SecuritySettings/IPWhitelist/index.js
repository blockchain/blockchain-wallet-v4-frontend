import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='d-flex h6 padding-bottom-10 text-capitalize'>
      <FormattedMessage id='scenes.settings.whitelist.title' defaultMessage='IP Whitelist' />
    </div>
    <div className='d-flex'>
      <FormattedMessage id='scenes.settings.whitelist.description' defaultMessage='Allow login without email authentication from the following list of comma-separated IP addresses. Use % as a wildcard.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='d-flex button-secondary'>
      <FormattedMessage id='scenes.settings.whitelist.change' defaultMessage='Change' />
    </button>
  </div>
)

export default {
  description, settings
}
