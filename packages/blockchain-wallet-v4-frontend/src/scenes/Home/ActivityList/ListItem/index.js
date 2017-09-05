import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'

import { Icon, Text } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: calc(100% - 30px);
  height: 60px;
  margin: 0 20px;
  border-left: 1px solid ${props => props.theme['gray-2']};
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`
const Circle = styled.div`
  position: absolute;
  left: -15px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background-color: ${props => props.theme['white']};
  border: 1px solid ${props => props.theme['gray-2']};
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

const selectIcon = type => {
  switch (type) {
    case 'log': return 'settings'
    default: return 'tx'
  }
}

const ActivityListItem = (props) => {
  const { action, time, type } = props
  const timeFormatted = moment(time).format('ll')
  const iconName = selectIcon(type)

  return (
    <Container>
      <Circle>
        <Icon name={iconName} color='brand-primary' />
      </Circle>
      <Info>
        <Text size='14px' weight={300} capitalize>{action}</Text>
        <Text size='14px' weight={300}>{timeFormatted}</Text>
      </Info>
    </Container>
  )
}

ActivityListItem.propTypes = {
  action: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  type: PropTypes.string
}

ActivityListItem.defaultProps = {
  type: 'log'
}

export default ActivityListItem
