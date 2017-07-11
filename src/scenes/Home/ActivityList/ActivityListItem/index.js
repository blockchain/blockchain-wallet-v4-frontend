import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon } from 'components/generic/Icon'
import { Typography } from 'components/generic/Typography'

const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
`
const MarkerContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 60px;
  height: 100%;
`
const MarkerBorder = styled.div`
  height: 100%;
  width: 1px;
  background-color: #D2CED0;
`
const MarkerCircle = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background-color: #004A7C;
  border-radius: 100%;
  text-align: center;
`
const LogContainer = styled.div`
  width: calc(100% - 60px);
  height: 100%;
`
const InfoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 40px;
  padding: 8px 0;
  border: 1px solid #D2CED0;
`
const TypeContainer = styled.div`
  width: 30%;
  padding: 0 5px;
`
const TimeContainer = styled.div`
  width: 30%;
  padding: 0 5px;
`
const DetailsContainer = styled.div`
  width: 40%;
  padding: 0 5px;
`

const ActivityListItem = (props) => {
  return (
    <Row>
      <MarkerContainer>
        <MarkerBorder />
        <MarkerCircle>
          <Icon name='icon-tx' white />
        </MarkerCircle>
      </MarkerContainer>
      <LogContainer>
        <InfoContainer>
          <TypeContainer>
            <Typography small>{props.activity.title}</Typography>
          </TypeContainer>
          <TimeContainer>
            <Typography smaller light>{props.activity.time}</Typography>
          </TimeContainer>
          <DetailsContainer>
            <Typography smaller light>{props.activity.description}</Typography>
          </DetailsContainer>
        </InfoContainer>
      </LogContainer>
    </Row>
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
