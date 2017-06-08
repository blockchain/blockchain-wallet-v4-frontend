import React from 'react'
import CSSModules from 'react-css-modules'

import ActivityListItem from './ActivityListItem'

import style from './style.scss'

const ActivityList = (props) => {
  return (
    <div className='container-fluid padding-20 border-box'>
      <div className='row padding-bottom-20'>
        <span className='f-16 em-400 capitalize'>Most recent activity</span>
      </div>
      <div className='row flex-column padding-left-15'>
        {props.activities.map(function (activity, key) {
          return <ActivityListItem activity={activity} key={key} />
        })}
      </div>
    </div>
  )
}

export default CSSModules(ActivityList, style)
