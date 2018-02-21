import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Text } from 'blockchain-info-components'

const TabsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme['white-blue']};
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #EAEAEA;;
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
  border-bottom: ${props => props.active ? '1px solid black' : null};
  opacity: ${props => props.active ? 1 : 0.3};
  text-transform: uppercase;
`

const SecurityTabs = (props) => {
  return (
    <TabsWrapper>
      <TabList>
        <Tab active={props.active === 'security'} onClick={() => { props.setActive('security'); props.setView('security') }}>
          <FormattedMessage id='scenes.securitycenter.tabssecurity' defaultMessage='Security' />
        </Tab>
        <Tab active={props.active === 'advanced'} onClick={() => { props.setActive('advanced'); props.setView('advanced') }}>
          <FormattedMessage id='scenes.securitycenter.tabsadvanced' defaultMessage='Advanced Security' />
        </Tab>
      </TabList>
    </TabsWrapper>
  )
}

export default SecurityTabs
