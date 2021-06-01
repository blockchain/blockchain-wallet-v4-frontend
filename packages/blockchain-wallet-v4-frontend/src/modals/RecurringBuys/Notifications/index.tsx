import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

import { TopText } from '../../components'
import AnimatedCarousel from './AnimatedCarousel'

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
`

const Slide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`
const SlideStart = styled(Slide)`
  justify-content: flex-start;
`

const SlideContent = styled.div`
  padding: 0 40px;
`

const SyncIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 20px;
  margin-right: 20px;
  background-color: ${(props) => props.theme.blue100};
`

const IconsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

const TitleText = styled(Text)`
  display: flex;
  flex-direction: row;
  flex: 1;
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
          <TopText spaceBetween={false} marginBottom>
            <SyncIconWrapper>
              <Icon name='sync-regular' color='blue600' size='20px' />
            </SyncIconWrapper>
            <TitleText size='20px' color='grey900' weight={600}>
              <FormattedMessage
                id='modals.recurringbuys.notification.title'
                defaultMessage='Recurring buys'
              />
            </TitleText>
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
          </TopText>
        </FlyoutWrapper>

        <MainContent>
          <AnimatedCarousel>
            <Slide>
              <SlideContent>
                <Text size='32px' weight={600} color='grey900' style={{ marginBottom: '40px' }}>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_1.title'
                    defaultMessage='Instead of timing the market, many smart investors use'
                  />
                </Text>
                <Text size='32px' weight={600} color='blue600' lineHeight='40px'>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_1.description'
                    defaultMessage='Dollar cost averaging'
                  />
                </Text>
              </SlideContent>
            </Slide>
            <SlideStart>
              <Image name='graph-recurring-buys' width='100%' height='164' />
              <SlideContent>
                <Text size='32px' weight={600} color='grey900' style={{ marginBottom: '40px' }}>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_2.title'
                    defaultMessage='The strategy is pretty simple'
                  />
                </Text>
                <Text size='32px' weight={600} color='blue600' lineHeight='40px'>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_2.description'
                    defaultMessage='Invest the same amount every week'
                  />
                </Text>
              </SlideContent>
            </SlideStart>
            <SlideStart>
              <Image name='graph-recurring-buys-2' width='100%' height='164' />
              <SlideContent>
                <Text size='32px' weight={600} color='grey900' style={{ marginBottom: '40px' }}>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_3.title'
                    defaultMessage='When the price goes down,'
                  />
                </Text>
                <Text size='32px' weight={600} color='blue600' lineHeight='40px'>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_3.description'
                    defaultMessage='You’ll buy more crypto.'
                  />
                </Text>
              </SlideContent>
            </SlideStart>
            <SlideStart>
              <Image name='graph-recurring-buys-3' width='100%' height='164' />
              <SlideContent>
                <Text size='32px' weight={600} color='grey900' style={{ marginBottom: '40px' }}>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_4.title'
                    defaultMessage='When the price goes up,'
                  />
                </Text>
                <Text size='32px' weight={600} color='blue600' lineHeight='40px'>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_4.description'
                    defaultMessage='You’ll buy less.'
                  />
                </Text>
              </SlideContent>
            </SlideStart>
            <Slide>
              <SlideContent>
                <Text size='32px' weight={600} color='grey900' style={{ marginBottom: '40px' }}>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_5.title'
                    defaultMessage='But does it work?'
                  />
                </Text>
                <Text size='32px' weight={600} color='grey900' lineHeight='40px'>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_5.description'
                    defaultMessage='Over the past 5 years, buying Bitcoin every week performed better than timing the market'
                  />
                </Text>
                <Text size='32px' weight={600} color='blue600' lineHeight='40px'>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_5.disclaimer'
                    defaultMessage='82% of the time.'
                  />
                </Text>
              </SlideContent>
            </Slide>
          </AnimatedCarousel>
        </MainContent>
        <FooterWrapper>
          <Button
            nature='primary'
            data-e2e='setUpRecurringBuys'
            type='button'
            fullwidth
            height='48px'
            color='red400'
            style={{ marginTop: '16px' }}
            onClick={() => {
              // alert
            }}
          >
            <FormattedMessage
              id='modals.recurringbuys.notification.button'
              defaultMessage='Setup recurring buy'
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
