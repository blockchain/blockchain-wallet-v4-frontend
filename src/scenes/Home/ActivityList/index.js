import React from 'react'
import CSSModules from 'react-css-modules'

import ActivityListItem from './ActivityListItem'

import style from './style.scss'

const ActivityList = (props) => {
  return (
    <div styleName='activity-list'>
      Most Recent Activity
      <ul>
        {props.activities.map(function (activity, key) {
          return <ActivityListItem activity={activity} key={key} />
        })}
      </ul>
    </div>
  )
}

export default CSSModules(ActivityList, style)
