import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Button, Image, Text } from 'blockchain-info-components'
import { NavLink } from 'react-router-dom'

import ListItem from './ListItem'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};
`
const Header = styled.div`
  width: 100%;
`
const Content = styled.div`
  width: 100%;
  margin-top: 10px;
`

const NoActivityWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 500px;
`

const ActivityList = (props) => {
  const { activities } = props

  return (
    <Wrapper>
      <Header>
        <Text uppercase size='24px' weight={300} color='brand-primary'>
          <FormattedMessage id='scenes.home.activitylist.title' defaultMessage='Most recent activities' />
        </Text>
      </Header>
      <Content>
        { (activities.length === 0)
          ? <NoActivityWrapper>
            <Image name='blue-logo' width='40px' height='40px' />
            <Text size='18px' weight={300}>
              <FormattedMessage id='scenes.home.activitylist.notx' defaultMessage='No transactions yet? No problem.' />
              <br />
              <FormattedMessage id='scenes.home.activitylist.addfunds' defaultMessage='Get started by adding some funds to your wallet!' />
            </Text>
            <NavLink to='/buy-sell'>
              <Button uppercase rounded nature='primary'>
                <FormattedMessage id='scenes.faq.item1.clickhere' defaultMessage='Click here to get started' />
              </Button>
            </NavLink>
          </NoActivityWrapper>
          : activities.map(function (activity, index) {
            const { action, time } = activity
            return <ListItem action={action} time={time} key={index} />
          })
        }
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
