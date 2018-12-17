import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import { getData } from './selectors'

import { LinkContainer } from 'react-router-bootstrap'
import { TabMenu, TabMenuItem } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 12px 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const LinkItem = styled(TabMenuItem)`
  &.active {
    & :after {
      position: absolute;
      content: '';
      top: 37px;
      left: 0;
      width: 100%;
      border-bottom: 4px solid ${props => props.theme['brand-secondary']};
    }
  }
`

export const MenuTop = ({ historySelected, showGetStarted }) =>
  !showGetStarted ? (
    <Wrapper>
      <TabMenu>
        <LinkContainer to='/swap' exact>
          <LinkItem activeClassName='active' data-e2e='exchangeTabMenuExchange'>
            <FormattedMessage
              id='scenes.exchange.menutop.swap'
              defaultMessage='Swap'
            />
          </LinkItem>
        </LinkContainer>
        <LinkContainer to='/swap/history'>
          <LinkItem
            activeClassName='active'
            data-e2e='exchangeTabMenuOrderHistory'
          >
            <FormattedMessage
              id='scenes.exchange.menutop.history'
              defaultMessage='Order History'
            />
          </LinkItem>
        </LinkContainer>
      </TabMenu>
    </Wrapper>
  ) : (
    <div />
  )

export default connect(getData)(MenuTop)
