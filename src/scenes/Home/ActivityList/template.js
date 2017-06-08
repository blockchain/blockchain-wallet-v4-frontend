import React from 'react'
import CSSModules from 'react-css-modules'

import ActivityListItem from './ActivityListItem'

import style from './style.scss'

const ActivityList = (props) => {
  return (
    <div className='container-fluid padding-30' styleName='activity-list'>
      <div className='row'>
        <span className='f-14 em-400 capitalize'>Most recent activity</span>
      </div>
      <div className='row flex-column'>
        {props.activities.map(function (activity, key) {
          return <ActivityListItem activity={activity} key={key} />
        })}
      </div>
    </div>
  )
}

export default CSSModules(ActivityList, style)
