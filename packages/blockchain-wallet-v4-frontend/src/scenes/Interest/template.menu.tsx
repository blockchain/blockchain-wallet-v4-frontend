import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { TabMenu, TabMenuItem } from 'blockchain-info-components'

const TabRow = styled.div`
  width: 100%;
  display: flex;
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
