import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: calc(100% - 30px);
  height: 60px;
  margin: 0 20px;
  border-left: 1px solid #DDDDDD;
  border-bottom: 1px solid #DDDDDD;
`
const Circle = styled.div`
  position: absolute;
  left: -15px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background-color: #FFFFFF;
  border: 1px solid #DDDDDD;
  border-radius: 100%;
  text-align: center;
`
const Info = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 40px;
  padding: 10px 20px;
  box-sizing: border-box;

  & > * { 
    padding: 0 5px; 
    width: 50%;
  }
`

const ActivityListItem = (props) => {
  return (
    <Container>
      <Circle>
        <Icon name='tx' color='dark-blue' />
      </Circle>
      <Info>
        <Text size='14px' weight={300} capitalize>{props.activity.title}</Text>
        <Text size='14px' weight={300}>{props.activity.time}</Text>
      </Info>
    </Container>
  )
}

ActivityListItem.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
  })
}

export default ActivityListItem
