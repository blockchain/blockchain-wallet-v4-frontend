import React from 'react'
import './style.scss'

const ActivityListItem = (props) => {
  console.log(props)
  return (
    <li className='activity-list-item'>
      <div className='box'>
        <h5>{props.activity.title}</h5>
        <span>{props.activity.time}</span>
        <span>{props.activity.description}</span>
      </div>
    </li>
  )
}

export default ActivityListItem
