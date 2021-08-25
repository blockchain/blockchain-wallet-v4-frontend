import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, FlyoutFooter, FlyoutHeader, Image, Link, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { getBaseAmount } from 'data/components/simpleBuy/model'

import { Props as _P } from '.'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 480px;
  height: 100vh;
`
const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
`

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
  color: ${(props) => props.theme.grey900};
`

const FooterWrapper = styled(FlyoutWrapper)`
  padding-top: 0px;
`
const GetStarted = ({ close, nextStep, order }: Props) => {
  const amount = getBaseAmount(order)
  const currency = order.outputCurrency
  const closeModal = useCallback(() => {
    close()
  }, [])

  return (
    <Wrapper>
      <FlyoutHeader data-e2e='RecurringBuysCloseButton' mode='close' onClick={closeModal} />
      <MainContent>
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
          <>
            <Description>
              <FormattedMessage
                id='modals.recurringbuys.get_started.description'
                defaultMessage='Buy {amount} of {currency} every day, week or month with a Recurring Buy. No need to ever time the market.'
                values={{
                  amount,
                  currency
                }}
              />
              <Link
                size='16px'
                weight={500}
                target='_blank'
                href='https://support.blockchain.com/hc/en-us/'
              >
                <FormattedMessage id='buttons.learn_more_arrow' defaultMessage='Learn more ->' />
              </Link>
            </Description>
          </>
        </TextContentWrapper>
      </MainContent>
      <FlyoutFooter>
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
      </FlyoutFooter>
    </Wrapper>
  )
}

type OwnProps = { nextStep: () => void }
type Props = _P & OwnProps

export default GetStarted
