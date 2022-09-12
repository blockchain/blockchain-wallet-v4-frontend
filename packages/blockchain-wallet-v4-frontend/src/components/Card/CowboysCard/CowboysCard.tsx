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
import { ModalName } from 'data/types'
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
  height: 38px;
  width: 38px;
  border-radius: 50%;
  background: url('/img/cowboys.svg') no-repeat center center;
  background-color: white;
  background-size: 22px;
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
  const { data: cowboysData, hasError: cowboysHasError } = useRemote(
    selectors.modules.profile.getCowboysTag
  )
  const { data: isRegistered, hasError: hasRegisterError } = useRemote(
    selectors.components.buySell.isUserSddVerified
  )

  const buttonAction = useCallback(() => {
    let step: CowboysPromoStepsType = 'signup'
    if (cowboysData && isRegistered) {
      step = 'verifyId'
    }
    dispatch(actions.modals.showModal(ModalName.COWBOYS_PROMO, { origin: 'CowboysCard', step }))
  }, [cowboysData, dispatch, isRegistered])

  if (cowboysHasError || !cowboysData || !show) return null

  const titleText = (
    <FormattedMessage id='copy.cowboys.cowboys_promo' defaultMessage='Cowboys Promo' />
  )
  const descText =
    cowboysData && isRegistered ? (
      <FormattedMessage
        id='copy.cowboys.verify_your_id'
        defaultMessage='Verify your ID and start referring friends to get the opportunity to WIN tickets'
      />
    ) : (
      <FormattedMessage
        id='copy.cowboys.complete_the_sign_up'
        defaultMessage='Complete the sign up to be entered into the Merch raffle!'
      />
    )
  const actionText =
    cowboysData && isRegistered ? (
      <FormattedMessage id='buttons.verify_now' defaultMessage='Verify Now' />
    ) : (
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
              <Text color='white' size='16px' weight={700} lineHeight='24px'>
                {descText}
              </Text>
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
