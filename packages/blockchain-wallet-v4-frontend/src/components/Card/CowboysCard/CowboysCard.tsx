import React, { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { CowboysPromoStepsType } from 'blockchain-wallet-v4-frontend/src/modals/Onboarding/CowboysPromo/types'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { Card } from 'components/Card'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'
import { actions, selectors } from 'data'
import { Analytics, ModalName } from 'data/types'
import { useRemote } from 'hooks'

const CowboysCard = styled(Card)`
  background: url('/img/prescott-card-bg.png') no-repeat top right;
  background-color: black;
  position: absolute;
  bottom: 40px;
  left: 40px;
  z-index: 99;
  height: 218px;
  width: 400px;
  border-radius: 20px;
  display: flex;

  & > div {
    display: flex;
  }
`

const CowboyIcon = styled.div`
  height: 42px;
  width: 42px;
  background: url('/img/cowboys.svg') no-repeat center center;
  background-size: 42px;
`

const CardDismissButton = styled.div`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`

const CowboysCardComponent = () => {
  const dispatch = useDispatch()
  const [show, setShow] = useState(true)
  const {
    data: cowboysData,
    hasError: cowboysHasError,
    isLoading: cowboysLoading
  } = useRemote(selectors.modules.profile.getCowboysTag)
  const {
    data: isGoldVerified,
    hasError: isGoldVerifiedError,
    isLoading: isGoldVerifiedLoading
  } = useRemote(selectors.modules.profile.isUserVerified)
  const {
    data: currentTier, // Checking for Silver tier users `currentTier === 1`
    hasError: isCurrentTierError,
    isLoading: isCurrentTierLoading
  } = useRemote(selectors.modules.profile.getCurrentTier)

  const buttonAction = useCallback(() => {
    let step: CowboysPromoStepsType = 'signup' // level 1
    if (!isGoldVerified && currentTier === 1) {
      // level 2
      step = 'verifyId'
      dispatch(
        actions.analytics.trackEvent({
          key: Analytics.COWBOYS_VERIFY_IDENTITY_ANNOUNCEMENT_CLICKED,
          properties: {}
        })
      )
    } else if (isGoldVerified) {
      dispatch(
        actions.analytics.trackEvent({
          key: Analytics.COWBOYS_REFER_FRIENDS_ANNOUNCEMENT_CLICKED,
          properties: {}
        })
      )

      // level 3
      return dispatch(
        actions.modals.showModal(ModalName.REFERRAL_LANDING_MODAL, { origin: 'CowboysCard' })
      )
    } else {
      dispatch(
        actions.analytics.trackEvent({
          key: Analytics.COWBOYS_COMPLETE_SIGN_UP_ANNOUCEMENT_CLICKED,
          properties: {
            type: 'signed_up'
          }
        })
      )
    }

    dispatch(actions.modals.showModal(ModalName.COWBOYS_PROMO, { origin: 'CowboysCard', step }))
  }, [currentTier, dispatch, isGoldVerified])

  if (cowboysLoading || isGoldVerifiedLoading || isCurrentTierLoading) return null
  if (cowboysHasError || isGoldVerifiedError || isCurrentTierError) return null
  if (!cowboysData || !show) return null

  const titleText = (
    <FormattedMessage id='copy.cowboys.cowboys_promo' defaultMessage='Cowboys Promo' />
  )
  const descText =
    !isGoldVerified && currentTier === 1 ? ( // level 2
      <Text color='white' size='16px' weight={700} lineHeight='24px'>
        <FormattedMessage
          id='copy.cowboys.verify_your_id'
          defaultMessage='Verify your ID and start referring friends to get the opportunity to WIN tickets'
        />
      </Text>
    ) : isGoldVerified ? ( // level 3
      <Text color='white' size='24px' weight={600} lineHeight='24px'>
        <FormattedMessage
          id='copy.cowboys.refer_friends_win_tickets'
          defaultMessage='Refer friends and win suite tickets!'
        />
      </Text>
    ) : (
      // level 1
      <Text color='white' size='16px' weight={600} lineHeight='24px'>
        <FormattedMessage
          id='copy.cowboys.complete_the_sign_up'
          defaultMessage='Complete the sign up to be entered into the Merch raffle!'
        />
      </Text>
    )
  const actionText =
    !isGoldVerified && currentTier === 1 ? ( // level 2
      <FormattedMessage id='buttons.verify_now' defaultMessage='Verify Now' />
    ) : isGoldVerified ? ( // level 3
      <FormattedMessage id='buttons.signup_now' defaultMessage='Invite Now' />
    ) : (
      // level 1
      <FormattedMessage id='buttons.signup_now' defaultMessage='Sign Up Now' />
    )

  return (
    <CowboysCard elevation={1}>
      <Padding all={20}>
        <Flex>
          <Flex flexDirection='column' justifyContent='space-between'>
            <Flex justifyContent='space-between'>
              <CowboyIcon />
              <CardDismissButton>
                <Icon
                  cursor
                  data-e2e='close'
                  name='close'
                  size='15px'
                  color='white'
                  role='button'
                  onClick={() => {
                    setShow(false)
                  }}
                />
              </CardDismissButton>
            </Flex>
            <Flex flexDirection='column'>
              <Text color='white' size='16px' weight={500} lineHeight='24px'>
                {titleText}
              </Text>
              {descText}
              <Padding top={8}>
                <Button data-e2e='VerifyNowButton' nature='white-blue' onClick={buttonAction}>
                  <Text color='black' size='14px' weight={600}>
                    {actionText}
                  </Text>
                </Button>
              </Padding>
            </Flex>
          </Flex>
        </Flex>
      </Padding>
    </CowboysCard>
  )
}

export default CowboysCardComponent
