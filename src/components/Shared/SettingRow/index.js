import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const SettingRow = (props) => (
  <div className='container-fluid' styleName='setting-row'>
    <div className='row justify-content-between'>
      <div className='col-12 col-md-6 padding-bottom-10'>
        {props.component.description}
      </div>
      <div className='col-12 col-md-6 d-flex justify-content-end'>
        {props.component.settings}
      </div>
    </div>
  </div>
)

export default CSSModules(SettingRow, style)
