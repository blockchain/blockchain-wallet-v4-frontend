import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import Cookies from 'universal-cookie'

import { getIsSuperAppEnabled } from '@core/redux/walletOptions/selectors'
import { Image, Text } from 'blockchain-info-components'
import { Separator } from 'layouts/Wallet/components'

import { Container, LeftContainer, SeparatorWrapper, TextContainer } from './styles'

export const Divider = () => (
  <SeparatorWrapper>
    <Separator />
  </SeparatorWrapper>
)

const SuperAppLink = () => {
  const isSuperAppEnabled = useSelector(getIsSuperAppEnabled).getOrElse(false)
  const hasSuperAppAccess = localStorage.getItem('wallet_v5_ui_available') === 'true'

  const handleClick = () => {
    const optOutDate = localStorage.getItem('opt_out_date')

    if (optOutDate) {
      localStorage.removeItem('opt_out_date')
    }
    localStorage.setItem('opt_out_wallet_v5_ui', 'false')

    window.location.reload()
  }

  if (!isSuperAppEnabled || !hasSuperAppAccess) return null

  return (
    <>
      <Divider />
      <Container onClick={handleClick}>
        <LeftContainer>
          <Image name='super-app-icon' size='32px' />
          <TextContainer>
            <Text color='alertsNegative' weight={500} lineHeight='18px' size='12px'>
              <FormattedMessage defaultMessage='NEW' id='scene.wallet.menu.new' />
            </Text>
            <Text weight={600} lineHeight='21px' size='14px'>
              <FormattedMessage
                defaultMessage='Try the new wallet'
                id='scene.wallet.menu.try-new-wallet'
              />
            </Text>
          </TextContainer>
        </LeftContainer>
        <Image name='arrow-right-circle' size='16px' />
      </Container>
    </>
  )
}

export default SuperAppLink
