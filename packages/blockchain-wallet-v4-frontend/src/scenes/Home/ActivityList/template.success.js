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
  flex: 1;
  width: 100%;
  padding: 15px;
  margin-top: 15px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-1']};
  @media (max-height: 800px), (max-width: 992px) {
    height: 300px;
    display: block;
  }
  @media (max-height: 800px) {
    margin-bottom: 30px;
  }
  @media (max-width: 992px) {
    margin-bottom: 0;
  }
`
const headerHeight = '29px'
const Header = styled.div`
  width: 100%;
  height: ${headerHeight};
`
const Content = styled.div`
  width: 100%;
  height: calc(100% - ${headerHeight} - 10px);
  overflow-y: auto;
  margin-top: 10px;

  > div:first-child {
    border-left: none;
    position: relative;
  }
  > div:first-child:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 50%;
    border-left: 1px solid ${props => props.theme['gray-2']};
  }
  > div:last-child {
    border-bottom: none;
    border-left: none;
  }
  > div:last-child:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 50%;
    border-left: 1px solid ${props => props.theme['gray-2']};
  }
`

const Success = props => (
  <Wrapper>
    <Header>
      <Text uppercase size='24px' weight={300} color='brand-primary'>
        <FormattedMessage
          id='scenes.home.activitylist.title'
          defaultMessage='Recent Activity'
        />
      </Text>
    </Header>
    <Content>
      {props.activities.length === 0 ? (
        <Empty partner={props.partner} handleRequest={props.handleRequest} />
      ) : (
        props.activities.map((activity, index) => (
          <ListItem key={index} {...activity} />
        ))
      )}
    </Content>
  </Wrapper>
)

Success.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      action: PropTypes.string.isRequired,
      time: PropTypes.number.isRequired,
      amount: PropTypes.number,
      type: PropTypes.string,
      coin: PropTypes.string
    })
  ).isRequired
}

export default Success
