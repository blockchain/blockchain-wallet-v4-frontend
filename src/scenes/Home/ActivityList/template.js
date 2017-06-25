import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import CSSModules from 'react-css-modules'

import ActivityListItem from './ActivityListItem'

import style from './style.scss'

const ActivityList = (props) => {
  return (
    <div className='container-fluid' styleName='activity-list'>
      <div className='row padding-bottom-20'>
        <div className='col-auto h6 text-capitalize'>
          <FormattedMessage id='scenes.home.activitylist.title' defaultMessage='Most recent activities' />
        </div>
      </div>
      <div className='row'>
        <div className='col-12 padding-left-50'>
          {props.activities.map(function (activity, key) {
            return <ActivityListItem activity={activity} key={key} />
          })}
        </div>
      </div>
    </div>
  )
}

ActivityList.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
  }))
}

export default CSSModules(ActivityList, style)
