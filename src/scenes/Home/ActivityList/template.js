import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'

import ListItem from './ListItem'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid #DDDDDD;
`
const Header = styled.div`
  width: 100%;
`
const Content = styled.div`
  width: 100%;
  margin-top: 10px;
`

const ActivityList = (props) => {
  const { activities } = props
  console.log(activities)
  return (
    <Wrapper>
      <Header>
        <Text uppercase size='24px' weight={300} color='dark-blue'>
          <FormattedMessage id='scenes.home.activitylist.title' defaultMessage='Most recent activities' />
        </Text>
      </Header>
      <Content>
        { activities.map(function (activity, index) {
          const { action, time } = activity
          return <ListItem action={action} time={time} key={index} />
        })}
      </Content>
    </Wrapper>
  )
}

ActivityList.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.shape({
    action: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired
  }))
}

ActivityList.defaultProps = {
  activities: []
}

export default ActivityList
