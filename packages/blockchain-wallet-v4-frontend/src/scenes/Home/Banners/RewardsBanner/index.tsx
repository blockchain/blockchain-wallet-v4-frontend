import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Icon } from '@blockchain-com/constellation'
import { IconCloseCircleV2, IconPercent } from '@blockchain-com/icons'
import { bindActionCreators } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { actions } from 'data'
import { Analytics } from 'data/types'
import { media } from 'services/styles'

import { getEarnRewardsAnnouncement } from '../selectors'
import { BannerButton, CloseLink, IconWrapper, Row } from '../styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 0.5rem;
  padding: 1.25rem;

  ${media.atLeastLaptop`
    height: 5rem;
    padding: 0 1.25rem;
  `}
  ${media.mobile`
    padding: 0,75rem;
    flex-direction: column;
  `}
`

const Column = styled.div`
  display: flex;
  flex-direction: column;

  & > div:first-child {
    margin-bottom: 0.25rem;
  }
`
const PendingIconWrapper = styled(IconWrapper)`
  background-color: ${(props) => props.theme.blue100};
`
const Copy = styled(Text)`
  display: flex;
  align-items: center;
  margin-right: 1.25rem;
  font-size: 0.75rem;
`

const StartEarningRewards: React.FC<Props> = (props) => {
  const {
    analyticsActions: { trackEvent }
  } = props
  const { BANNER_REWARDS_CLICKED, BANNER_REWARDS_VIEWED } = Analytics

  useEffect(() => {
    trackEvent({
      key: BANNER_REWARDS_VIEWED,
      properties: {
        device: 'WEB',
        platform: 'WALLET'
      }
    })
  }, [])

  const handleClick = () => {
    trackEvent({
      key: BANNER_REWARDS_CLICKED,
      properties: {
        device: 'WEB',
        platform: 'WALLET'
      }
    })
  }

  const completeAnnouncement = getEarnRewardsAnnouncement()

  return (
    <Wrapper>
      <Row>
        <PendingIconWrapper>
          <Icon label='percentage' color='blue600' size='md'>
            <IconPercent />
          </Icon>
        </PendingIconWrapper>
        <Column>
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage
              id='copy.banner_rewards_header'
              defaultMessage='Start earning with just $1 in crypto'
            />
          </Text>
          <Copy size='16px' color='grey600' weight={500}>
            <FormattedMessage
              id='copy.banner_rewards_body'
              defaultMessage='You can now move as little as $1 to a Rewards Account to start earning rewards.'
            />
          </Copy>
        </Column>
      </Row>
      <LinkContainer to='/rewards'>
        <BannerButton jumbo data-e2e='goToRewards' nature='primary' onClick={handleClick}>
          <FormattedMessage id='modals.tradinglimits.earn_interest' defaultMessage='Earn Rewards' />
        </BannerButton>
      </LinkContainer>
      <CloseLink
        data-e2e='newCoinCloseButton'
        onClick={() => props.cacheActions.announcementDismissed(completeAnnouncement)}
      >
        <Icon label='close' color='grey600' data-e2e='sanctionsInfoCloseModalIcon' size='md'>
          <IconCloseCircleV2 />
        </Icon>
      </CloseLink>
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(StartEarningRewards)
