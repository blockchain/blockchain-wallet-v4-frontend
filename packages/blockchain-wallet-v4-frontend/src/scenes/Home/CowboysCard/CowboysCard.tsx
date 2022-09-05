import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { Card } from 'components/Card'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'
import { selectors } from 'data'
import { useRemote } from 'hooks'
import { media } from 'services/styles'

const CowboysCard = styled(Card)`
  background: url('/img/prescott-card-bg.png') no-repeat top right;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 219px;
  width: 400px;
  border-radius: 20px;
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
  const [show, setShow] = useState(true)
  const { data, hasError } = useRemote(selectors.modules.profile.getCowboysTag)
  if (hasError || !data || !show) return null
  return (
    <CowboysCard backgroundColor='black'>
      <Padding all={20}>
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
            <Text color='white'>Cowboys Promo</Text>
            <Text color='white'>
              Verify your ID and start referring friends to get the opportunity to WIN tickets!
            </Text>
            <Button data-e2e='VerifyNowButton' nature='dark-grey' fullwidth={false}>
              Verify Now
            </Button>
          </Flex>
        </Flex>
      </Padding>
    </CowboysCard>
  )
}

export default CowboysCardComponent
