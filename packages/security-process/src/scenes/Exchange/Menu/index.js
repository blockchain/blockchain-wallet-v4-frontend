import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'

import { actions } from 'data'
import { getData } from './selectors'
import { Button, TabMenu, TabMenuItem } from 'blockchain-info-components'
import Announcements from 'components/Announcements'
import HorizontalMenu from 'components/HorizontalMenu'

const LinkItem = styled(TabMenuItem)`
  &.active {
    & :after {
      position: absolute;
      content: '';
      top: 37px;
      left: 0;
      width: 100%;
      border-bottom: 4px solid ${props => props.theme['brand-secondary']};
      z-index: 99;
    }
  }
`
const SupportButton = styled(Button)`
  margin-left: auto;
  height: 38px;
`

export const Menu = ({ showGetStarted, showHelpModal }) =>
  !showGetStarted ? (
    <React.Fragment>
      <Announcements type='service' alertArea='swap' />
      <HorizontalMenu>
        <TabMenu>
          <LinkContainer to='/swap' exact>
            <LinkItem
              activeClassName='active'
              data-e2e='exchangeTabMenuExchange'
            >
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
          <SupportButton nature='primary' onClick={showHelpModal}>
            <FormattedMessage
              id='scenes.exchange.menutop.need_help'
              defaultMessage='Need Help?'
            />
          </SupportButton>
        </TabMenu>
      </HorizontalMenu>
    </React.Fragment>
  ) : (
    <div />
  )

const mapDispatchToProps = dispatch => ({
  showHelpModal: () => dispatch(actions.modals.showModal('Support'))
})

export default connect(
  getData,
  mapDispatchToProps
)(Menu)
