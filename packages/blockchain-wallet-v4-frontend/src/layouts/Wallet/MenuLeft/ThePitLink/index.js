import React from 'react'
import { FormattedMessage } from 'react-intl'
import Joyride from 'react-joyride/lib'

import { Link, Text } from 'blockchain-info-components'
import { Destination, MenuIcon, MenuItem } from 'components/MenuLeft'
import {
  JoyrideSpotlight,
  PitJoyrideStyles,
  SpotlightLinkContainer,
  StepContent,
  StepIcon,
  StepTitle
} from 'components/Tour'

import { PitTooltip } from './model'

import { NewCartridge } from '../Navigation/template'

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
  const { firstLogin, showThePitPulse, handleTourCallbacks } = props

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <SpotlightLinkContainer to='/thepit' activeClassName='active'>
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
            run={!firstLogin && showThePitPulse}
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
                placement: 'right'
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
          <PitJoyrideStyles />
        </MenuItem>
      </SpotlightLinkContainer>
    </div>
  )
}

const ThePitLink = props => {
  return props.userEligibleForPIT ? (
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
      <PitLinkContent {...props} />
    )
  ) : null
}

export default ThePitLink
