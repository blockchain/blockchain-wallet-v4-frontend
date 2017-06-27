import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='h6'>
      <FormattedMessage id='scenes.settings.secondpassword.title' defaultMessage='Second Wallet Password' />
    </div>
    <div className='flex-row'>
      <FormattedMessage id='scenes.settings.secondpassword.description' defaultMessage='For additional security, you can choose a second password that is asked whenever you want to spend bitcoins.' />
      <FormattedMessage id='scenes.settings.secondpassword.description2' defaultMessage='Beware that there is no password reset functionality.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='button-secondary'>
      <FormattedMessage id='scenes.settings.secondpassword.change' defaultMessage='Set second password' />
    </button>
  </div>
)

export default {
  description, settings
}
