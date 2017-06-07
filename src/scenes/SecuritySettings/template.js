import React from 'react'
import CSSModules from 'react-css-modules'

import BasicSecurity from './BasicSecurity'
import AdvancedSecurity from './AdvancedSecurity'

import style from './style.scss'

const SecuritySettings = ({ advanced, toggleAdvanced }) => {
  return (
    <section styleName='security-settings'>
      <BasicSecurity />
      <button className='button-empty margin-vertical-10' onClick={toggleAdvanced}>Advanced Settings</button>
      {advanced && (<AdvancedSecurity />)}
    </section>
  )
}

export default CSSModules(SecuritySettings, style)
