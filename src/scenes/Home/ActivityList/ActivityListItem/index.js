import React from 'react'

import style from './style.scss'

const ActivityListItem = (props) => {
  return (
    <li className={style.activityListItem}>
      <div className={style.box}>
        {props.activity.title}
        {props.activity.time}
        {props.activity.description}
      </div>
    </li>
  )
}

export default ActivityListItem
