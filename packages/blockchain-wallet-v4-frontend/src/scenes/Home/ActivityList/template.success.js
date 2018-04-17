import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'

import Empty from './Empty'
import ListItem from './ListItem'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 300px;
  padding: 15px;
  margin-top: 15px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-1']};
`
const Header = styled.div`
  width: 100%;
`
const Content = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 10px;
  overflow: scroll;
`

const Success = props => (
  <Wrapper>
    <Header>
      <Text uppercase size='24px' weight={300} color='brand-primary'>
        <FormattedMessage id='scenes.home.activitylist.title' defaultMessage='Recent Activity' />
      </Text>
    </Header>
    <Content>
      { (props.activities.length === 0)
        ? <Empty />
        : props.activities.map((activity, index) => <ListItem action={activity.action} type={activity.type} amount={activity.amount} time={activity.time} coin={activity.coin} key={index} />)
      }
    </Content>
  </Wrapper>
)

Success.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.shape({
    action: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired,
    amount: PropTypes.number,
    type: PropTypes.string,
    coin: PropTypes.string
  })).isRequired
}

export default Success
