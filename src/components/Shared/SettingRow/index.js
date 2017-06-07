import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const SettingRow = (props) => (
  <div styleName='setting-row'>
    <div styleName='description'>
      <label className='label'>{props.component.title}</label>
      <div>
        {props.component.description}
      </div>
    </div>
    <div styleName='settings'>
      {props.component.settings}
    </div>
  </div>
)

export default CSSModules(SettingRow, style)
