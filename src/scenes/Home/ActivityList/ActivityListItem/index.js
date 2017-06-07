import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const ActivityListItem = (props) => {
  return (
    <li styleName='activity-list-item'>
      <div styleName='box'>
        {props.activity.title}
        {props.activity.time}
        {props.activity.description}
      </div>
    </li>
  )
}

export default CSSModules(ActivityListItem, style)
