import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Image, Link, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

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

const IconsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`
const FooterWrapper = styled(FlyoutWrapper)`
  padding-top: 0px;
`
class Notifications extends PureComponent<Props> {
  handleSubmit = (e) => {
    e.preventDefault()
    // TODO add proper call to start recurring buys setup
  }

  render() {
    return (
      <Wrapper>
        <FlyoutWrapper>
          <IconsContainer>
            <Icon
              cursor
              data-e2e='RecurringBuysCloseButton'
              name='close'
              size='20px'
              color='grey600'
              role='button'
              onClick={this.props.handleClose}
            />
          </IconsContainer>
        </FlyoutWrapper>

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
                    amount: '100',
                    currency: 'BTC'
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
        <FooterWrapper>
          <Button
            nature='primary'
            data-e2e='getStartedWithRecurringBuys'
            type='button'
            fullwidth
            height='48px'
            style={{ marginTop: '16px' }}
            onClick={() => {
              // alert
            }}
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
            onClick={() => {
              // alert
            }}
          >
            <FormattedMessage
              id='modals.recurringbuys.get_started.maybe_later'
              defaultMessage='Maybe Later'
            />
          </Button>
        </FooterWrapper>
      </Wrapper>
    )
  }
}

type Props = {
  handleClose: () => void
}

export default Notifications
