import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import CSSModules from 'react-css-modules'

import BasicSecurity from './BasicSecurity'
import AdvancedSecurity from './AdvancedSecurity'

import style from './style.scss'

const SecuritySettings = (props) => {
  return (
    <section styleName='settings'>
      <BasicSecurity />
      <button className='button-empty margin-vertical-10' onClick={props.clickAdvancedSecurity}>
        <FormattedMessage id='scenes.settings.advancedsettings' defaultMessage='Advanced settings' />
      </button>
      { props.advancedSecurityDisplayed ? (
        <AdvancedSecurity />
      ) : (
        <div />
      )}
    </section>
  )
}

SecuritySettings.propTypes = {
  advancedSecurityDisplayed: PropTypes.bool.isRequired,
  clickAdvancedSecurity: PropTypes.func.isRequired
}

export default CSSModules(SecuritySettings, style)
