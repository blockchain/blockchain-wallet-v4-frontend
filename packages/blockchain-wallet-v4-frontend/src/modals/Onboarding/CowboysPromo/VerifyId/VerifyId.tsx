import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Button, Icon, Image, Text, TextGroup } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'
import { Padding } from 'components/Padding'
import { actions } from 'data'
import { ModalName } from 'data/types'

import { VerifyIdComponent } from '../types'

const StyledFlyoutContainer = styled(FlyoutContainer)`
  background-image: url('/img/cowboy-suite.png');
`

const VerifyId: VerifyIdComponent = ({ handleClose }) => {
  const dispatch = useDispatch()

  const verifyCallback = useCallback(() => {
    // todo
  }, [dispatch])

  return (
    <StyledFlyoutContainer>
      <FlyoutHeader mode='close' data-e2e='CowboysSignupModal' onClick={handleClose} />
      <FlyoutContent mode='middle'>
        <Flex flexDirection='column' alignItems='center'>
          <Padding horizontal={77}>
            <Text color='grey900' size='24px' weight={700} style={{ textAlign: 'center' }}>
              <FormattedMessage
                id='copy.cowboys.suite_experience'
                defaultMessage='Win a Suite experience!'
              />
            </Text>
          </Padding>
          <Padding bottom={40} horizontal={77}>
            <Text color='grey900' size='16px' weight={500} style={{ textAlign: 'center' }}>
              <FormattedMessage
                id='copy.cowboys.verify_and_enter_suite'
                defaultMessage='<b>Verify your ID & refer 3+ friends</b> to be entered to win a <b>Blockchain.com suite experience.</b> You and 7 friends will see the <b>Dallas Cowboys</b> take on the Houston <b>Texans</b> live on <b>December 11th!</b>'
              />
            </Text>
          </Padding>
          <Padding bottom={40} horizontal={77}>
            <Text color='grey900' size='16px' weight={500} style={{ textAlign: 'center' }}>
              <FormattedMessage
                id='copy.cowboys.winners_announced'
                defaultMessage='Winners will be announced on [DATE]'
              />
            </Text>
          </Padding>
          <Padding>
            <Image name='cowboys-jersey' />
          </Padding>
        </Flex>
      </FlyoutContent>
      <FlyoutFooter collapsed>
        <Padding bottom={16}>
          <Button
            data-e2e='CowboySignupContinueButton'
            nature='primary'
            fullwidth
            onClick={verifyCallback}
          >
            <FormattedMessage
              id='modals.confirm.confirm.verify_identity'
              defaultMessage='Verify My Identity'
            />
          </Button>
        </Padding>
        <Button
          data-e2e='CowboySignupDismissButton'
          nature='empty-blue'
          fullwidth
          onClick={handleClose}
        >
          <FormattedMessage
            id='modals.recurringbuys.get_started.maybe_later'
            defaultMessage='Maybe Later'
          />
        </Button>
      </FlyoutFooter>
    </StyledFlyoutContainer>
  )
}

export default VerifyId
