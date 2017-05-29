import React from 'react'
import './style.scss'

import ActivityListItem from './ActivityListItem'

const ActivityList = (props) => {
  return (
    <div className='activity-list'>
      <h5>Most Recent Activity</h5>
      <ul>
        {props.activities.map(function (activity, key) {
          return <ActivityListItem activity={activity} key={key} />
        })}
      </ul>
    </div>
  )
}

export default ActivityList
