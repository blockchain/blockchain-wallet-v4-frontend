import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const ActivityListItem = (props) => {
  return (
    <div className='container-fluid margin-bottom-40 border'>
      <div className='row'>
        <div className='col-4'>
          <div styleName='marker' className='border-left'>
            <div styleName='marker-circle'>
              <i styleName='icon' className='icon-tx' />
            </div>
          </div>
          <span className='em-400 capitalize'>{props.activity.title}</span>
        </div>
        <div className='col-3'>
          <span>{props.activity.time}</span>
        </div>
        <div className='col-5'>
          <span>{props.activity.description}</span>
        </div>
      </div>
    </div>
  )
}

export default CSSModules(ActivityListItem, style)
