import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Icon, Text } from 'blockchain-info-components'

const TabsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme['gray-1']};
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #CCCCCC;
  padding: 0px 30px;
`
const TabList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  div:first-of-type {
    margin-right: 25px;
  }
`
const Tab = styled(Text)`
  cursor: pointer;
  border-bottom: 1px solid black;
  opacity: ${props => props.active ? 1 : 0.3}
`

const SecurityTabs = (props) => {
  return (
    <TabsWrapper>
      <TabList>
        <Tab active={props.active === 'security'} onClick={() => props.setActive('security')}>
          Security
        </Tab>
        <Tab active={props.active === 'advanced'} onClick={() => props.setActive('advanced')}>
          Advanced Security
        </Tab>
      </TabList>
    </TabsWrapper>
  )
}

export default SecurityTabs
