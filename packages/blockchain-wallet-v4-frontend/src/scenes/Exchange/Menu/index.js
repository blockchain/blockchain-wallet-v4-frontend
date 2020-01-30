import { actions } from 'data'
import { Button, TabMenu, TabMenuItem } from 'blockchain-info-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import { LinkContainer } from 'react-router-bootstrap'
import Announcements from 'components/Announcements'
import HorizontalMenu from 'components/HorizontalMenu'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: sticky;
`

const SupportButton = styled(Button)`
  margin-left: auto;
  height: 38px;
  ${media.laptop`
    margin-left: 0;
    margin-top: 8px;
  `}
`

export const Menu = ({ showGetStarted, showHelpModal }) =>
  !showGetStarted ? (
    <Wrapper>
      <Announcements type='service' alertArea='swap' />
      <HorizontalMenu>
        <TabMenu>
          <LinkContainer to='/swap' exact>
            <TabMenuItem
              activeClassName='active'
              data-e2e='exchangeTabMenuExchange'
            >
              <FormattedMessage
                id='scenes.exchange.menutop.swap'
                defaultMessage='Swap'
              />
            </TabMenuItem>
          </LinkContainer>
          <LinkContainer to='/swap/history'>
            <TabMenuItem
              activeClassName='active'
              data-e2e='exchangeTabMenuOrderHistory'
            >
              <FormattedMessage
                id='scenes.exchange.menutop.history'
                defaultMessage='Order History'
              />
            </TabMenuItem>
          </LinkContainer>
        </TabMenu>
        <SupportButton nature='primary' onClick={showHelpModal}>
          <FormattedMessage
            id='scenes.exchange.menutop.need_help'
            defaultMessage='Need Help?'
          />
        </SupportButton>
      </HorizontalMenu>
    </Wrapper>
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
