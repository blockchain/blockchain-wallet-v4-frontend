import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import Joyride from 'react-joyride/lib'

import { Link, TooltipIcon, TooltipHost } from 'blockchain-info-components'
import { Destination, MenuIcon, MenuItem } from 'components/MenuLeft'
import {
  JoyrideSpotlight,
  PitJoyrideStyles,
  SpotlightLinkContainer,
  StepContent,
  StepIcon,
  StepTitle
} from 'components/Tour'

import PitTooltip from './PitTooltip'

const HelperTipContainer = styled.div`
  position: relative;
  > div span {
    color: ${props => props.theme['gray-3']};
  }
`
const HelperTip = styled(TooltipHost)`
  position: absolute;
  left: 12px;
  top: -8px;
`

const ThePitSidenavItem = (showSpotlight, isPitAccountLinked) => (
  <>
    <JoyrideSpotlight className='the-pit-tooltip' />
    <MenuIcon name='the-pit' style={{ paddingLeft: '2px' }} size='24px' />
    <Destination>
      <FormattedMessage
        id='layouts.wallet.menuleft.navigation.thepitexchange'
        defaultMessage='The PIT Exchange'
      />
    </Destination>
    {isPitAccountLinked && (
      <HelperTipContainer>
        <HelperTip id='pitSideNavConnected'>
          <TooltipIcon color='blue' name='info' />
        </HelperTip>
      </HelperTipContainer>
    )}
  </>
)

const PitLink = props => (
  <SpotlightLinkContainer to='/thepit' activeClassName='active'>
    {props.children}
  </SpotlightLinkContainer>
)

const PitLinkContent = props => {
  const {
    firstLogin,
    handlePitTourCallbacks,
    hasRunWalletTour,
    hasSkippedTour,
    showThePitPulse
  } = props
  const isTourFinished = hasRunWalletTour || hasSkippedTour
  const runJoyride = firstLogin
    ? isTourFinished && showThePitPulse
    : showThePitPulse

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <PitLink {...props}>
        <MenuItem data-e2e='thePitLink'>
          {ThePitSidenavItem(runJoyride)}
          <Joyride
            run={runJoyride}
            steps={[
              {
                target: '.the-pit-tooltip',
                content: (
                  <>
                    <StepIcon name='the-pit' size='56px' color='pitBlue' />
                    <StepTitle size='20px' weight={600}>
                      <FormattedMessage
                        id='the.pit.tooltip.title'
                        defaultMessage='Trade in The PIT.'
                      />
                    </StepTitle>
                    <StepContent color='grey600' size='14px' weight={500}>
                      <FormattedMessage
                        id='the.pit.tooltip.contentshort'
                        defaultMessage="Link and exchange over 26 pairs in The PIT - Blockchain's own lightning fast crypto exchange."
                      />
                    </StepContent>
                  </>
                ),
                disableBeacon: true,
                placement: 'right',
                props
              }
            ]}
            tooltipComponent={PitTooltip}
            callback={handlePitTourCallbacks}
            showSkipButton={true}
            styles={{
              overlay: {
                backgroundColor: 'none'
              }
            }}
            {...props.Joyride}
            {...props}
          />
          <PitJoyrideStyles />
        </MenuItem>
      </PitLink>
    </div>
  )
}

const ThePitLink = props => {
  return props.isPitAccountLinked ? (
    <Link
      href={`${props.pitUrl}&utm_source=web_wallet&utm_medium=referral&utm_campaign=sidenav_pit_linked`}
      rel='noopener noreferrer'
      target='_blank'
      style={{ width: '100%' }}
      onClick={props.onLinkedPitSidenavCLick}
    >
      <MenuItem data-e2e='thePitLink'>
        {ThePitSidenavItem(null, props.isPitAccountLinked)}
      </MenuItem>
    </Link>
  ) : (
    <PitLinkContent {...props} />
  )
}

export default ThePitLink
