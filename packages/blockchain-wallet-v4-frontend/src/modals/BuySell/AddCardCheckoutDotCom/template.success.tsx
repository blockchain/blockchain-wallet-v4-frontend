import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { Card } from 'components/Card'
import { Expanded, Flex } from 'components/Flex'
import { FlyoutWrapper } from 'components/Flyout'
import { Padding } from 'components/Padding'

import { Props as OwnProps, SuccessStateType } from '.'

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

const UnstyledHyperlink = styled.a`
  color: inherit;
  text-decoration: inherit;
`

export type Props = OwnProps & SuccessStateType & { domain: string }

const Success = (props: Props) => {
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
          onClick={() =>
            props.buySellActions.setStep({
              cryptoCurrency: props.cryptoCurrency || 'BTC',
              fiatCurrency: props.fiatCurrency,
              pair: props.pair,
              step: 'PAYMENT_METHODS'
            })
          }
        />
        <FormattedMessage id='buttons.add_card' defaultMessage='Add Card' />
      </Top>

      <Expanded>
        <Flex flexDirection='column' style={{ height: '100%' }} gap={16}>
          <Expanded>
            <Iframe src={props.domain} />
          </Expanded>

          <Card backgroundColor='grey000' borderRadius='md'>
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

                <UnstyledHyperlink
                  href='https://support.blockchain.com/hc/en-us/articles/5154350610716'
                  target='_blank'
                >
                  <Button data-e2e='creditCardInfo.learnMoreButton' nature='dark' rounded>
                    <FormattedMessage
                      id='addCardCheckoutDotCom.creditCardInfoCard.button'
                      defaultMessage='Learn More'
                    />
                  </Button>
                </UnstyledHyperlink>
              </Flex>
            </Padding>
          </Card>
        </Flex>
      </Expanded>
    </CustomFlyoutWrapper>
  )
}

export default Success
