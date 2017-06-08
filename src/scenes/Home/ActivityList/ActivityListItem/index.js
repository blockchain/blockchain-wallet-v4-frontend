import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const ActivityListItem = (props) => {
  return (
    <div className='container-fluid padding-bottom-30 border-left' styleName='activity-item'>
      <div className='row flex-row'>
        <div styleName='marker'>
          <i className='icon-tx' />
        </div>
        <div className='container-fluid flex-row flex-between border padding-10'>
          <span className='em-400 capitalize'>{props.activity.title}</span>
          <span>{props.activity.time}</span>
          <span>{props.activity.description}</span>
        </div>
      </div>
    </div>
  )
}

export default CSSModules(ActivityListItem, style)
