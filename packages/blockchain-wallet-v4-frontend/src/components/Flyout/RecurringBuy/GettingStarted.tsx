import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Link, Text } from 'blockchain-info-components'
import { FiatType } from 'core/types'

import Container from '../Container'
import Content from '../Content'
import Footer from '../Footer'
import Header from '../Header'

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
`
const TextContentWrapper = styled.div`
  margin-top: 18px;
  padding: 0 40px;
  display: flex;
  flex-direction: column;

  a {
    display: content;
    margin-left: 2px;
  }
`

const Description = styled(Text)`
  text-align: center;
  line-height: 24px;
  font-size: 14px;
  margin: 0 25px;
  color: ${(props) => props.theme.grey900};
`

const GettingStarted = ({ amount, close, nextStep, outputCurrency }: Props) => {
  const closeModal = useCallback(() => {
    close()
  }, [])

  return (
    <Container>
      <Header data-e2e='RecurringBuysCloseButton' mode='close' onClick={closeModal} />
      <Content mode='middle'>
        <div>
          <ContentWrapper>
            <Image name='recurring-buy-get-started' height='130px' width='222px' />
          </ContentWrapper>
          <TextContentWrapper>
            <ContentWrapper>
              <Text size='20px' weight={600} color='grey900' lineHeight='30px'>
                <FormattedMessage
                  id='modals.recurringbuys.get_started.title'
                  defaultMessage='Set Up a Recurring Buy'
                />
              </Text>
            </ContentWrapper>
            <Description>
              <FormattedMessage
                id='modals.recurringbuys.get_started.description'
                defaultMessage='Buy {amount} of {outputCurrency} every day, week or month with a Recurring Buy. No need to ever time the market.'
                values={{
                  amount,
                  outputCurrency
                }}
              />
              <Link
                size='14px'
                weight={500}
                target='_blank'
                href='https://support.blockchain.com/hc/en-us/sections/4405090131860-Recurring-Buys-'
              >
                <FormattedMessage id='buttons.learn_more_arrow' defaultMessage='Learn more ->' />
              </Link>
            </Description>
          </TextContentWrapper>
        </div>
      </Content>
      <Footer>
        <Button
          nature='primary'
          data-e2e='getStartedWithRecurringBuys'
          type='button'
          fullwidth
          height='48px'
          style={{ marginTop: '16px' }}
          onClick={nextStep}
        >
          <FormattedMessage
            id='modals.recurringbuys.get_started.get_started'
            defaultMessage='Get Started'
          />
        </Button>
        <Button
          nature='light'
          data-e2e='maybeLaterRecurringBuys'
          type='button'
          fullwidth
          height='48px'
          style={{ marginTop: '16px' }}
          onClick={closeModal}
        >
          <FormattedMessage
            id='modals.recurringbuys.get_started.maybe_later'
            defaultMessage='Maybe Later'
          />
        </Button>
      </Footer>
    </Container>
  )
}

export type Props = {
  amount: string
  close: () => void
  nextStep: () => void
  outputCurrency: string
}

export default GettingStarted
