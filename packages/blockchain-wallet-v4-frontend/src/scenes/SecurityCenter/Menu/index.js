import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'

import { TabMenu, TabMenuItem } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  padding: 8px 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const LinkItem = styled(TabMenuItem)`
  &.active {
    & :after {
      position: absolute;
      content: '';
      top: 36px;
      left: 0;
      width: 100%;
      border-bottom: 4px solid ${props => props.theme['brand-secondary']};
    }
  }
`

class MenuContainer extends React.PureComponent {
  render () {
    return (
      <Wrapper>
        <TabMenu>
          <LinkContainer to='/security-center/basic' activeClassName='active'>
            <LinkItem>
              <FormattedMessage
                id='scenes.securitycenter.menu.basic'
                defaultMessage='Basic'
              />
            </LinkItem>
          </LinkContainer>
          <LinkContainer
            to='/security-center/advanced'
            activeClassName='active'
          >
            <LinkItem>
              <FormattedMessage
                id='scenes.securitycenter.menu.advanced'
                defaultMessage='Advanced'
              />
            </LinkItem>
          </LinkContainer>
        </TabMenu>
      </Wrapper>
    )
  }
}

export default MenuContainer
