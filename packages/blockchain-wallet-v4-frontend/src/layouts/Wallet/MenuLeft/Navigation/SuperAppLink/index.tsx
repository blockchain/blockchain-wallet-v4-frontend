import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import Cookies from 'universal-cookie'

import { Image, Text } from 'blockchain-info-components'

import { Divider } from '../index'
import { getData } from './selectors'
import { Container, TextContainer } from './styles'

const SuperAppLink = () => {
  const { isSuperAppEnabled } = useSelector(getData)
  const cookies = new Cookies()
  const hasSuperAppAccess = cookies.get('has_access')

  const handleClick = () => {
    cookies.set('opt_out', 'false', { path: '/' })
    window.location.reload()
  }

  if (!isSuperAppEnabled || !hasSuperAppAccess) return null

  return (
    <>
      <Divider />
      <Container onClick={handleClick}>
        <Image name='super-app-icon' size='32px' />
        <TextContainer>
          <Text color='alertsNegative' weight={500} lineHeight='18px' size='12px'>
            <FormattedMessage defaultMessage='NEW' id='scene.wallet.menu.new' />
          </Text>
          <Text weight={600} lineHeight='21px' size='12px'>
            <FormattedMessage
              defaultMessage='Try out the new wallet'
              id='scene.wallet.menu.try-new-wallet'
            />
          </Text>
        </TextContainer>
        <Image name='arrow-right-circle' size='16px' />
      </Container>
    </>
  )
}

export default SuperAppLink
