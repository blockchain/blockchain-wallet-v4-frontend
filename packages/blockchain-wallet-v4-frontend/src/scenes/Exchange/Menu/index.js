import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import { getData } from './selectors'

import { LinkContainer } from 'react-router-bootstrap'
import { TabMenu, TabMenuItem } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
  border-bottom: 1px solid ${props => props.theme['gray-1']};

  > div > span:first-child {
    padding-left: 0;
  }
`

export const MenuTop = ({ historySelected, showGetStarted }) =>
  !showGetStarted ? (
    <Wrapper>
      <TabMenu>
        <LinkContainer to='/exchange' exact>
          <TabMenuItem selected={!historySelected} data-e2e='exchangeTabMenuExchange'>
            <FormattedMessage
              id='scenes.exchange.menutop.exchange'
              defaultMessage='Exchange'
            />
          </TabMenuItem>
        </LinkContainer>
        <LinkContainer to='/exchange/history'>
          <TabMenuItem selected={historySelected} data-e2e='exchangeTabMenuOrderHistory'>
            <FormattedMessage
              id='scenes.exchange.menutop.history'
              defaultMessage='Order History'
            />
          </TabMenuItem>
        </LinkContainer>
      </TabMenu>
    </Wrapper>
  ) : (
    <div />
  )

export default connect(getData)(MenuTop)
