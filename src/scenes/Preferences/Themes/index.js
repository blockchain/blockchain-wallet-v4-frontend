import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='d-flex h6 padding-bottom-10 text-capitalize'>
      <FormattedMessage id='scenes.preferences.themes.title' defaultMessage='Themes' />
    </div>
    <div className='d-flex'>
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
