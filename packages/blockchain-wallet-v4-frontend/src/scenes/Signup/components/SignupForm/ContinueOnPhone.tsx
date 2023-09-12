import React from 'react'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Card } from 'components/Card'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'
import { isMobile } from 'services/styles'

const ContinueOnPhoneCard = styled(Card)`
  border-color: ${(props) => props.theme.orange600};
  margin-top: 1rem;
`
const ButtonsContainer = styled.div`
  display: flex;

  > button:first-of-type {
    margin-right: 0.5rem;
  }
`

type Props = {
  setShowModal?: (e) => void
}

const ContinueOnPhone: React.FC<Props> = ({ setShowModal = () => {} }) => {
  const mobile = isMobile()

  return (
    <ContinueOnPhoneCard backgroundColor='grey-000' borderRadius='md' borderWidth={1}>
      <Padding all={16}>
        <Flex flexDirection='column' gap={16} alignItems='flex-start'>
          <Flex flexDirection='column' gap={8}>
            <Text color='orange600' size='14px' lineHeight='20px' weight={600}>
              Continue on {mobile ? 'the app' : 'your phone'}
            </Text>

            <Text
              color='grey900'
              size='12px'
              lineHeight='18px'
              weight={500}
              style={{ marginTop: '8px' }}
            >
              At this moment, the Blockchain.com Wallet is only available on mobile for your region.
              To start enjoying your Blockchain.com experience, download the app.
            </Text>
          </Flex>

          {!mobile && (
            <ButtonsContainer>
              <Button data-e2e='' nature='dark' rounded small onClick={() => setShowModal('iOS')}>
                Download for iOS
              </Button>
              <Button
                data-e2e=''
                nature='dark'
                rounded
                small
                onClick={() => setShowModal('Android')}
              >
                Download for Android
              </Button>
            </ButtonsContainer>
          )}
        </Flex>
      </Padding>
    </ContinueOnPhoneCard>
  )
}

export default ContinueOnPhone
