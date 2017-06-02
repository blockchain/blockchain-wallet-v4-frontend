import React from 'react'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'

const SettingRow = (props) => (
  <div className={style.settingRow}>
    <div className={style.description}>
      <label className={typography.label}>{props.component.title}</label>
      <div>
        {props.component.description}
      </div>
    </div>
    <div className={style.settings}>
      {props.component.settings}
    </div>
  </div>
)

export default SettingRow
