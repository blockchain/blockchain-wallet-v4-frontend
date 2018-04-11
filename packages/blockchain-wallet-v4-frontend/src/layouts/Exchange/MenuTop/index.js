import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { LinkContainer } from 'react-router-bootstrap'
import { Image, Link, TabMenu, TabMenuItem, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const Shapeshift = styled(TextGroup)`
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  align-items: center;
  width: 170px;

  @media(max-width: 992px) { display: none; }
`

const MenuTop = (props) => (
  <Wrapper>
    <TabMenu>
      <LinkContainer to='/exchange' activeClassName='active' exact>
        <TabMenuItem>
          <FormattedMessage id='scenes.exchange.menutop.exchange' defaultMessage='Exchange' />
        </TabMenuItem>
      </LinkContainer>
      <LinkContainer to='/exchange/history' activeClassName='active'>
        <TabMenuItem>
          <FormattedMessage id='scenes.exchange.menutop.history' defaultMessage='Order History' />
        </TabMenuItem>
      </LinkContainer>
    </TabMenu>
    <Shapeshift>
      <Text size='12px' weight={300}>
        <FormattedMessage id='scenes.exchange.menutop.poweredby' defaultMessage='Powered by' />
      </Text>
      <Link href='https://www.shapeshift.io' target='_blank'>
        <Image name='shapeshiftLogo' width='60px' height='25px' />
      </Link>
    </Shapeshift>
  </Wrapper>
)

export default MenuTop
