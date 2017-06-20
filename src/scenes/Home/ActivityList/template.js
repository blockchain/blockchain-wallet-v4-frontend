import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import Translate from 'components/Shared/Translate'
import ActivityListItem from './ActivityListItem'

import style from './style.scss'

const ActivityList = (props) => {
  return (
    <div className='container-fluid' styleName='activity-list'>
      <div className='row padding-bottom-20'>
        <div className='col-auto'>
          <Translate className='h6 text-capitalize' translate='MOST_RECENT_ACTIVITY' />
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
