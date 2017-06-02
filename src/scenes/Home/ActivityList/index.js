import React from 'react'

import ActivityListItem from './ActivityListItem'

import style from './style.scss'

const ActivityList = (props) => {
  return (
    <div className={style.activityList}>
      Most Recent Activity
      <ul>
        {props.activities.map(function (activity, key) {
          return <ActivityListItem activity={activity} key={key} />
        })}
      </ul>
    </div>
  )
}

export default ActivityList
