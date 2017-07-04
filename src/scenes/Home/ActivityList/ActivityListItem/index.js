import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const ActivityListItemMarker = styled.div`
  position: absolute;
  left: -30px;
  top: -5px;
  width: 30px;
  height: 70px;
  color: #FFFFFF;
  border-left: 1px solid #EFEFEF;
`
const ActivityListItemMarkerCircle = styled.div`
  display: inline-block;
  position: relative;
  left: -15px;
  top: 5px;
  width: 30px;
  height: 30px;
  background-color: $blue;
  @include border-radius(100%);
  text-align: center;
`
const ActivityListItemMarkerIcon = styled.div`
  position: relative;
  top: 2px;
  font-size: 16px;
`

const ActivityListItem = (props) => {
  return (
    <div className='container-fluid margin-bottom-30 border'>
      <div className='row padding-vertical-5'>
        <div className='col-4'>
          <ActivityListItemMarker>
            <ActivityListItemMarkerCircle>
              <ActivityListItemMarkerIcon className='icon-tx' />
            </ActivityListItemMarkerCircle>
          </ActivityListItemMarker>
          <span className='text-capitalize'>{props.activity.title}</span>
        </div>
        <div className='col-3'>
          <span>{props.activity.time}</span>
        </div>
        <div className='col-5'>
          <span>{props.activity.description}</span>
        </div>
      </div>
    </div>
  )
}

ActivityListItem.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
  })
}

export default ActivityListItem
