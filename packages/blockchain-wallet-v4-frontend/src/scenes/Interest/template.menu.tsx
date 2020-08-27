import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { TabMenu, TabMenuItem } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const TabRow = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 26px;
`

const InterestMenu = () => {
  return (
    <TabRow>
      <TabMenu>
        <LinkContainer to='/interest' exact>
          <TabMenuItem data-e2e='interestTabMenuAccountss'>
            <FormattedMessage
              id='scenes.interest.tab.accounts'
              defaultMessage='Accounts'
            />
          </TabMenuItem>
        </LinkContainer>
        <LinkContainer to='/interest/history'>
          <TabMenuItem data-e2e='interestTabMenuHistory'>
            <FormattedMessage
              id='scenes.interest.tab.history'
              defaultMessage='Transaction History'
            />
          </TabMenuItem>
        </LinkContainer>
      </TabMenu>
    </TabRow>
  )
}

export default InterestMenu
