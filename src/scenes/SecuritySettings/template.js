import React from 'react'

import BasicSecurity from './BasicSecurity'
import AdvancedSecurity from './AdvancedSecurity'

import style from './style.scss'
import button from 'sass/elements/button.scss'

const SecuritySettings = ({ advanced, toggleAdvanced }) => {
  return (
    <section className={style.securitySettings}>
      <BasicSecurity />
      <button className={button.primary} onClick={toggleAdvanced}>Advanced Settings</button>
      {advanced && (<AdvancedSecurity />)}
    </section>
  )
}

export default SecuritySettings
