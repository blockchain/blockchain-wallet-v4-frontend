import React from 'react'
import PropTypes from 'prop-types'
import styled, { createGlobalStyle } from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { mapObjIndexed, toLower, values } from 'ramda'
import Joyride from 'react-joyride/lib'

import { Cartridge } from '@blockchain-com/components'
import {
  CoinIcon,
  Destination,
  MenuIcon,
  MenuItem,
  Separator,
  Wrapper
} from 'components/MenuLeft'
import {
  Link,
  Text,
  TooltipIcon,
  TooltipHost,
  Icon
} from 'blockchain-info-components'

import { PitTooltip } from './model'

const HelperTipContainer = styled.div`
  margin-left: auto;
  > div span {
    color: ${props => props.theme['gray-3']};
  }
`
const NewCartridge = styled(Cartridge)`
  color: ${props => props.theme['orange']} !important;
  background-color: ${props => props.theme['white']};
  letter-spacing: 1px;
  margin-left: auto;
  margin-right: -4px;
  padding: 4px 4px;
  border: 1px solid ${props => props.theme['gray-1']};
  border-radius: 4px;
`
const SpotlightLinkContainer = styled(LinkContainer)`
  position: relative;
`
const JoyrideSpotlight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto 11px;
  width: 28px;
  height: 28px;
`

const PitJoyrideStyles = createGlobalStyle`
  .__floater__open {
    transition: none !important;
    filter: none !important;
    margin-left: 170px !important;
  }
`

const renderPitSidenav = showSpotlight => (
  <MenuItem data-e2e='thePitLink'>
    {showSpotlight && <JoyrideSpotlight className='react-joyride__spotlight' />}
    <MenuIcon name='the-pit' style={{ paddingLeft: '2px' }} size='24px' />
    <Destination>
      <FormattedMessage
        id='layouts.wallet.menuleft.navigation.thepitbold'
        defaultMessage='The PIT'
      />
    </Destination>
    <NewCartridge>
      <Text color='orange' size='12' weight={500} uppercase>
        <FormattedMessage
          id='layouts.wallet.menuleft.navigation.transactions.new'
          defaultMessage='New'
        />
      </Text>
    </NewCartridge>
  </MenuItem>
)

const PitLinkContent = props => {
  const {
    pitSideNavTest3,
    firstLogin,
    showThePitPulse,
    onClickPitSideNavLink,
    handleTourCallbacks,
    hasRanPitTour,
    routeToPit
  } = props

  if (pitSideNavTest3 === 'sidenav_pulse_callout') {
    const StepTitle = styled(Text)`
      font-size: 20px;
      text-align: center;
      margin-bottom: 8px;
      line-height: 24px;
    `
    const StepIcon = styled(Icon)`
      margin: 0 auto 12px auto;
      width: fit-content;
    `
    const StepContent = styled(Text)`
      line-height: 24px;
    `
    return firstLogin || hasRanPitTour || !showThePitPulse ? (
      <SpotlightLinkContainer
        to='/thepit'
        activeClassName='active'
        onClick={onClickPitSideNavLink}
      >
        {renderPitSidenav()}
      </SpotlightLinkContainer>
    ) : (
      <div style={{ position: 'relative', width: '100%' }}>
        <MenuItem data-e2e='thePitLink'>
          <JoyrideSpotlight
            className='the-pit-tooltip'
            style={{ top: '-11px' }}
          />
          <MenuIcon name='the-pit' size='24px' />
          <Destination>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.thepitbold'
              defaultMessage='The PIT'
            />
          </Destination>
          <NewCartridge>
            <Text color='orange' size='12' weight={500} uppercase>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.transactions.new'
                defaultMessage='New'
              />
            </Text>
          </NewCartridge>
          <Joyride
            run={true}
            steps={[
              {
                target: '.the-pit-tooltip',
                content: (
                  <div data-e2e='tradePitPromo'>
                    <StepIcon name='the-pit' size='56px' color='pitBlue' />
                    <StepTitle size='20px' weight={600}>
                      <FormattedMessage
                        id='the.pit.tooltip.title'
                        defaultMessage='Trade in The PIT.'
                      />
                    </StepTitle>
                    <StepContent color='grey600' size='14px' weight={500}>
                      <FormattedMessage
                        id='the.pit.tooltip.content'
                        defaultMessage="Now that you have a Wallet, link and exchange over 26 pairs in The PIT - Blockchain's own lightning fast crypto exchange."
                      />
                    </StepContent>
                  </div>
                ),
                disableBeacon: true,
                placement: 'right',
                routeToPit
              }
            ]}
            tooltipComponent={PitTooltip}
            callback={handleTourCallbacks}
            showSkipButton={true}
            styles={{
              overlay: {
                backgroundColor: 'none'
              }
            }}
            {...props.Joyride}
          />
        </MenuItem>
        <PitJoyrideStyles />
      </div>
    )
  }

  return (
    <SpotlightLinkContainer
      to='/thepit'
      activeClassName='active'
      onClick={onClickPitSideNavLink}
    >
      {renderPitSidenav(!firstLogin && showThePitPulse)}
    </SpotlightLinkContainer>
  )
}

const Navigation = props => {
  const { ...rest } = props
  const { supportedCoins } = rest
  const coinOrder = [
    supportedCoins.PAX,
    supportedCoins.BTC,
    supportedCoins.ETH,
    supportedCoins.BCH,
    supportedCoins.XLM
  ]

  return (
    <Wrapper {...rest}>
      <LinkContainer to='/home' activeClassName='active'>
        <MenuItem data-e2e='dashboardLink'>
          <MenuIcon name='home' size='24px' />
          <Destination>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.dashboard'
              defaultMessage='Dashboard'
            />
          </Destination>
        </MenuItem>
      </LinkContainer>
      <SpotlightLinkContainer to='/buy-sell' activeClassName='active'>
        <MenuItem data-e2e='buyAndSellLink'>
          <JoyrideSpotlight className='wallet-intro-tour-step-5' />
          <MenuIcon name='cart-filled' size='24px' />
          <Destination>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.buysell'
              defaultMessage='Buy & Sell'
              className='destination'
            />
          </Destination>
        </MenuItem>
      </SpotlightLinkContainer>
      <SpotlightLinkContainer to='/swap' activeClassName='active'>
        <MenuItem data-e2e='exchangeLink'>
          <JoyrideSpotlight className='wallet-intro-tour-step-4' />
          <MenuIcon name='thick-arrow-switch' size='24px' />
          <Destination>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.swap'
              defaultMessage='Swap'
            />
          </Destination>
        </MenuItem>
      </SpotlightLinkContainer>
      <LinkContainer to='/lockbox' activeClassName='active'>
        <MenuItem data-e2e='lockboxLink'>
          <MenuIcon
            name='hardware'
            style={{ paddingLeft: '2px' }}
            size='24px'
          />
          <Destination>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.hardware'
              defaultMessage='Hardware'
            />
          </Destination>
          <HelperTipContainer>
            <TooltipHost id='lockboxRequired'>
              <TooltipIcon color='blue' name='info' />
            </TooltipHost>
          </HelperTipContainer>
        </MenuItem>
      </LinkContainer>
      {props.userNonRejectAndHasntDoneKyc ? (
        props.isPitAccountLinked ? (
          <Link
            href={props.pitUrl}
            rel='noopener noreferrer'
            target='_blank'
            style={{ width: '100%' }}
          >
            {renderPitSidenav()}
          </Link>
        ) : (
          <PitLinkContent {...rest} />
        )
      ) : null}
      <Separator />
      {values(
        mapObjIndexed(
          (coin, i) =>
            coin.txListAppRoute &&
            coin.invited && (
              <LinkContainer
                key={i}
                to={coin.txListAppRoute}
                activeClassName='active'
              >
                <MenuItem
                  data-e2e={`${toLower(coin.coinCode)}Link`}
                  colorCode={coin.colorCode}
                  className='coin'
                >
                  <CoinIcon
                    color={coin.colorCode}
                    name={coin.icons.circleFilled}
                    size='24px'
                  />
                  <Destination>{coin.displayName}</Destination>
                  {coin.showNewTagSidenav && (
                    <NewCartridge>
                      <Text color='orange' size='12' weight={500} uppercase>
                        <FormattedMessage
                          id='layouts.wallet.menuleft.navigation.transactions.new'
                          defaultMessage='New'
                        />
                      </Text>
                    </NewCartridge>
                  )}
                </MenuItem>
              </LinkContainer>
            ),
          coinOrder
        )
      )}
    </Wrapper>
  )
}

Navigation.propTypes = {
  lockboxOpened: PropTypes.bool
}

export default Navigation
