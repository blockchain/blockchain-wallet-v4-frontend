import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='h6'>
      <FormattedMessage id='scenes.preferences.themes.title' defaultMessage='Themes' />
    </div>
    <div>
      <FormattedMessage id='scenes.preferences.themes.description' defaultMessage='Try out different themes for the wallet.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    [Themes Dropdown]
  </div>
)

export default {
  description, settings
}
