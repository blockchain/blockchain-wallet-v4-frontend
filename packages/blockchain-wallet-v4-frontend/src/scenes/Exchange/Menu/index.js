import { actions } from 'data'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import { IconButton, TabMenu, TabMenuItem } from 'blockchain-info-components'
import { LinkContainer } from 'react-router-bootstrap'
import Announcements from 'components/Announcements'
import HorizontalMenu from 'components/HorizontalMenu'
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
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const DownloadButton = styled(IconButton)`
  border: 1px solid ${props => props.theme['grey100']};
  border-radius: 8px;
  color: ${props => props.theme['blue600']};
  margin-left: 8px;
`

const Menu = ({ downloadHistory, showGetStarted, showDownloadBtn }) =>
  !showGetStarted ? (
    <Wrapper>
      <Announcements type='service' alertArea='swap' />
      <HorizontalMenu>
        <ButtonRow>
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
          {showDownloadBtn && (
            <DownloadButton
              data-e2e='generateSwapReport'
              height='45px'
              width='135'
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
