import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme['white-blue']};
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #eaeaea;
  padding: 0 30px;
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
  border-bottom: ${props => (props.active ? '1px solid black' : null)};
  opacity: ${props => (props.active ? 1 : 0.3)};
  text-transform: uppercase;
`

class MenuContainer extends React.PureComponent {
  render () {
    const { activeTab, setActiveTab } = this.props

    return (
      <Wrapper>
        <TabList>
          <Tab
            active={activeTab === 'basic'}
            onClick={() => {
              setActiveTab('basic')
            }}
          >
            <FormattedMessage
              id='scenes.securitycenter.menu.basic'
              defaultMessage='Basic'
            />
          </Tab>
          <Tab
            active={activeTab === 'advanced'}
            onClick={() => {
              setActiveTab('advanced')
            }}
          >
            <FormattedMessage
              id='scenes.securitycenter.menu.advanced'
              defaultMessage='Advanced'
            />
          </Tab>
        </TabList>
      </Wrapper>
    )
  }
}

export default MenuContainer
