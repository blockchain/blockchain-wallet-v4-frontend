import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import Translate from 'components/Shared/Translate'
import BasicSecurity from './BasicSecurity'
import AdvancedSecurity from './AdvancedSecurity'

import style from './style.scss'

const SecuritySettings = (props) => {
  return (
    <section styleName='security-settings'>
      <BasicSecurity />
      <button className='button-empty margin-vertical-10' onClick={props.clickAdvancedSecurity}>
        <Translate translate='ADVANCED_SETTINGS' />
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
