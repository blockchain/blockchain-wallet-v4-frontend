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
        <LinkContainer to='/earn' exact>
          <TabMenuItem data-e2e='interestTabMenuAccountss' width='130px'>
            <FormattedMessage id='copy.all' defaultMessage='All' />
          </TabMenuItem>
        </LinkContainer>
        <LinkContainer to='/earn/history'>
          <TabMenuItem data-e2e='interestTabMenuHistory' width='130px'>
            <FormattedMessage id='copy.history' defaultMessage='History' />
          </TabMenuItem>
        </LinkContainer>
      </TabMenu>
    </TabRow>
  )
}

export default InterestMenu
