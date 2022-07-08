import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Icon, Text } from 'blockchain-info-components'
import { Expanded, Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import { CloseLink } from '../../../styles'
import {
  ApplePayImage,
  CardWrapper,
  GooglePayImage,
  PaymentImageIcon
} from './AppleAndGooglePayBannerView.styles'
import { AppleAndGooglePayBannerViewComponent } from './AppleAndGooglePayBannerView.types'

export const AppleAndGooglePayBannerView: AppleAndGooglePayBannerViewComponent = ({
  onClick,
  onClickClose
}) => {
  return (
    <CardWrapper>
      <Padding all={20}>
        <Flex flexDirection='row' alignItems='center' gap={16}>
          <PaymentImageIcon>
            <GooglePayImage name='google-pay' height='24px' />
            <ApplePayImage name='apple-pay' height='28px' />
          </PaymentImageIcon>

          <Expanded>
            <Flex flexDirection='column' gap={4}>
              <Text color='grey800' weight={600} size='20px'>
                <FormattedMessage
                  id='home.banners.appleAndGooglePayBanner.title'
                  defaultMessage='More Ways To Pay!'
                />
              </Text>

              <Text color='grey600' weight={500} size='12px'>
                <FormattedMessage
                  id='home.banners.appleAndGooglePayBanner.body'
                  defaultMessage='Now you can buy crypto with Apple Pay and Google Pay.'
                />
              </Text>
            </Flex>
          </Expanded>

          <Button
            data-e2e='appleAndGooglePayBanner.buyCryptoButton'
            nature='primary'
            onClick={onClick}
          >
            <FormattedMessage
              id='home.banners.appleAndGooglePayBanner.buyCrypto.title'
              defaultMessage='Buy Now'
            />
          </Button>

          <CloseLink data-e2e='newCoinCloseButton' onClick={onClickClose}>
            <Icon size='20px' color='grey400' name='close-circle' />
          </CloseLink>
        </Flex>
      </Padding>
    </CardWrapper>
  )
}
