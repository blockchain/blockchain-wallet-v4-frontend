import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { TabMenu, TabMenuItem } from 'blockchain-info-components'
import { withRouter } from 'react-router-dom'
import HorizontalMenu from 'components/HorizontalMenu'
import React from 'react'

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
            <TabMenuItem>
              <FormattedMessage
                id='scenes.securitycenter.menu.basic'
                defaultMessage='Basic'
              />
            </TabMenuItem>
          </LinkContainer>
          <LinkContainer
            to='/security-center/advanced'
            activeClassName='active'
            data-e2e='securityCenterAdvancedLink'
          >
            <TabMenuItem>
              <FormattedMessage
                id='scenes.securitycenter.menu.advanced'
                defaultMessage='Advanced'
              />
            </TabMenuItem>
          </LinkContainer>
        </TabMenu>
      </HorizontalMenu>
    )
  }
}

export default withRouter(MenuContainer)
