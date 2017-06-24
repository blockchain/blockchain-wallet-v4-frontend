import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='d-flex h6 padding-bottom-10 text-capitalize'>
      <FormattedMessage id='scenes.settings.secondpassword.title' defaultMessage='Second Wallet Password' />
    </div>
    <div className='d-flex'>
      <FormattedMessage id='scenes.settings.secondpassword.description' defaultMessage='For additional security, you can choose a second password 
      that is asked whenever you want to spend bitcoins. Beware that there is no password reset functionality.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='d-flex button-secondary'>
      <FormattedMessage id='scenes.settings.secondpassword.change' defaultMessage='Set second password' />
    </button>
  </div>
)

export default {
  description, settings
}
