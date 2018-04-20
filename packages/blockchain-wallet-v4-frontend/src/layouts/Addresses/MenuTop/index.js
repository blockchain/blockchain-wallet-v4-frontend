import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { LinkContainer } from 'react-router-bootstrap'
import { TabMenu, TabMenuItem } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`

const MenuTop = (props) => (
  <Wrapper>
    <TabMenu>
      <LinkContainer to='/settings/addresses' activeClassName='active' exact>
        <TabMenuItem>
          <FormattedMessage id='scenes.settings.addresses.menutop.btc' defaultMessage='Bitcoin' />
        </TabMenuItem>
      </LinkContainer>
      <LinkContainer to='/settings/addresses/bch' activeClassName='active'>
        <TabMenuItem>
          <FormattedMessage id='scenes.settings.addresses.menutop.bch' defaultMessage='Bitcoin Cash' />
        </TabMenuItem>
      </LinkContainer>
    </TabMenu>
  </Wrapper>
)

export default MenuTop
