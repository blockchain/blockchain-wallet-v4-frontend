import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { TabMenu, TabMenuItem } from 'blockchain-info-components'
import HorizontalMenu from 'components/HorizontalMenu'

const LinkItem = styled(TabMenuItem)`
  &.active {
    & :after {
      position: absolute;
      content: '';
      top: 34px;
      left: 0;
      width: 100%;
      border-bottom: 4px solid ${props => props.theme['brand-secondary']};
    }
  }
`

class MenuContainer extends React.PureComponent {
  render () {
    return (
      <HorizontalMenu>
        <TabMenu>
          <LinkContainer
            to='/security-center/basic'
            activeClassName='active'
            data-e2e='securityCenterBasicLink'
          >
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
            data-e2e='securityCenterAdvancedLink'
          >
            <LinkItem>
              <FormattedMessage
                id='scenes.securitycenter.menu.advanced'
                defaultMessage='Advanced'
              />
            </LinkItem>
          </LinkContainer>
        </TabMenu>
      </HorizontalMenu>
    )
  }
}

export default MenuContainer
