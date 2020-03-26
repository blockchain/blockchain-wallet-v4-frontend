import { actions } from 'data'
import {
  Button,
  IconButton,
  TabMenu,
  TabMenuItem
} from 'blockchain-info-components'
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
  background-color: ${props => props.theme.white};
  position: sticky;
  width: 100%;
  z-index: 1;
  top: 0;
`
const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`
const SupportButton = styled(Button)`
  margin-left: auto;
  border-radius: 8px;
  ${media.laptop`
    margin-left: 0;
    margin-top: 8px;
  `}
`
const DownloadButton = styled(IconButton)`
  border: 1px solid ${props => props.theme['grey100']};
  border-radius: 8px;
  color: ${props => props.theme['blue600']};
  margin-right: 12px;
`

const Menu = ({
  downloadHistory,
  showGetStarted,
  showDownloadBtn,
  showHelpModal
}) =>
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
        <ButtonRow>
          {showDownloadBtn && (
            <DownloadButton
              data-e2e='generateSwapReport'
              height='42px'
              name='download'
              nature='light'
              onClick={downloadHistory}
            >
              <FormattedMessage
                id='scenes.exchange.menutop.download'
                defaultMessage='Download'
              />
            </DownloadButton>
          )}
          <SupportButton height='42px' nature='primary' onClick={showHelpModal}>
            <FormattedMessage
              id='scenes.exchange.menutop.need_help'
              defaultMessage='Need Help?'
            />
          </SupportButton>
        </ButtonRow>
      </HorizontalMenu>
    </Wrapper>
  ) : (
    <div />
  )

const mapDispatchToProps = dispatch => ({
  downloadHistory: () =>
    dispatch(actions.components.exchangeHistory.downloadHistory()),
  showHelpModal: () => dispatch(actions.modals.showModal('Support'))
})

export default connect(
  getData,
  mapDispatchToProps
)(Menu)
