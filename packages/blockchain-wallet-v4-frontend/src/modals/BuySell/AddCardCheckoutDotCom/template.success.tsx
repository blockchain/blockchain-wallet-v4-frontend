import React, { RefObject, useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { Card } from 'components/Card'
import { Expanded, Flex } from 'components/Flex'
import { FlyoutWrapper } from 'components/Flyout'
import { Padding } from 'components/Padding'
import { ModalOriginType } from 'data/types'
import { useSardineContext } from 'hooks'

import { Props as OwnProps } from '.'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Iframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
`

const Top = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`

const RawHyperlink = styled.a`
  color: inherit;
  text-decoration: inherit;
`

export type Props = {
  buySellActions: OwnProps['buySellActions']
  cryptoCurrency?: OwnProps['cryptoCurrency']
  domain: string
  fiatCurrency: OwnProps['fiatCurrency']
  handleClose: OwnProps['handleClose']
  iframeRef: RefObject<HTMLIFrameElement>
  origin?: ModalOriginType
  pair: OwnProps['pair']
}

const Success = ({
  buySellActions,
  cryptoCurrency,
  domain,
  fiatCurrency,
  handleClose,
  iframeRef,
  origin,
  pair
}: Props) => {
  const [sardineContextIsReady, sardineContext] = useSardineContext('CARD_LINK')
  if (sardineContextIsReady) {
    sardineContext.updateConfig({
      flow: 'CARD_LINK'
    })
  }
  const handleOnClickBack = useCallback(() => {
    if (origin === 'SettingsGeneral') {
      handleClose?.()
    } else {
      buySellActions.setStep({
        cryptoCurrency: cryptoCurrency || 'BTC',
        fiatCurrency,
        pair,
        step: 'PAYMENT_METHODS'
      })
    }
  }, [origin, handleClose, buySellActions, cryptoCurrency, fiatCurrency, pair])

  return (
    <CustomFlyoutWrapper>
      <Top color='grey800' size='20px' weight={600}>
        <Icon
          cursor
          name='arrow-back'
          size='20px'
          color='grey600'
          role='button'
          style={{ marginRight: '24px' }}
          onClick={handleOnClickBack}
        />
        <FormattedMessage id='buttons.add_card' defaultMessage='Add Card' />
      </Top>

      <Expanded>
        <Flex flexDirection='column' style={{ height: '100%' }} gap={16}>
          <Expanded>
            <Iframe
              ref={iframeRef}
              sandbox='allow-forms allow-scripts allow-same-origin'
              src={domain}
            />
          </Expanded>

          <Card backgroundColor='grey-000' borderRadius='md'>
            <Padding all={16}>
              <Flex flexDirection='column' gap={16} alignItems='flex-start'>
                <Flex flexDirection='column' gap={8}>
                  <Text color='grey900' size='14px' lineHeight='20px' weight={600}>
                    <FormattedMessage
                      id='addCardCheckoutDotCom.creditCardInfoCard.title'
                      defaultMessage='Did you know?'
                    />
                  </Text>

                  <Text color='grey900' size='12px' lineHeight='18px' weight={500}>
                    <FormattedMessage
                      id='addCardCheckoutDotCom.creditCardInfoCard.content'
                      defaultMessage='Many credit cards don’t support crypto purchases. Debit cards usually work best.'
                    />
                  </Text>
                </Flex>

                <RawHyperlink
                  href='https://support.blockchain.com/hc/en-us/articles/4417061499284'
                  target='_blank'
                >
                  <Button data-e2e='creditCardInfo.learnMoreButton' nature='dark'>
                    <FormattedMessage
                      id='addCardCheckoutDotCom.creditCardInfoCard.button'
                      defaultMessage='Learn More'
                    />
                  </Button>
                </RawHyperlink>
              </Flex>
            </Padding>
          </Card>
        </Flex>
      </Expanded>
    </CustomFlyoutWrapper>
  )
}

export default Success
