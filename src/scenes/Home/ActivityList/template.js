import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Text } from 'components/generic/Text'
import ActivityListItem from './ActivityListItem'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  padding-right: 15px;
  box-sizing: border-box;
`
const Header = styled.div`
  width: 100%;
  padding: 10px 0;
`
const Content = styled.div`
  width: 100%;
`

const ActivityList = (props) => {
  return (
    <Wrapper>
      <Header>
        <Text id='scenes.home.activitylist.title' text='Most recent activities' capitalize />
      </Header>
      <Content>
        { props.activities.map(function (activity, key) {
          return <ActivityListItem activity={activity} key={key} />
        })}
      </Content>
    </Wrapper>
  )
}

ActivityList.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
  }))
}

export default ActivityList
