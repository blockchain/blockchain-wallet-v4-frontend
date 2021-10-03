import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutFooter, FlyoutHeader } from 'components/Flyout'
import { actions } from 'data'

import AnimatedCarousel from './AnimatedCarousel'
import AnimatedGraph from './AnimatedGraph'

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
  justify-content: center;
`

const SlideContent = styled.div`
  padding: 0 40px;
  text-align: center;
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

const TitleText = styled(Text)`
  display: flex;
  flex-direction: row;
  flex: 1;
`

class Notifications extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { stepIndex: 0 } as State
    this.stepChange = this.stepChange.bind(this)
    props.recurringBuyActions.infoViewed(this.state.stepIndex)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    // TODO add proper call to start recurring buys setup
  }

  stepChange = (stepIndex) => {
    this.props.recurringBuyActions.infoViewed(stepIndex)
    this.setState({ stepIndex })
  }

  render() {
    return (
      <Wrapper>
        <FlyoutHeader
          mode='close'
          onClick={this.props.handleClose}
          data-e2e='RecurringBuysCloseButton'
        >
          <SyncIconWrapper>
            <Icon name='sync-regular' color='blue600' size='20px' />
          </SyncIconWrapper>
          <FormattedMessage
            id='modals.recurringbuys.notification.title'
            defaultMessage='Recurring buys'
          />
        </FlyoutHeader>

        <MainContent>
          <AnimatedGraph stepIndex={this.state.stepIndex} />
          <AnimatedCarousel stepChange={this.stepChange}>
            <Slide>
              <SlideContent>
                <Text size='24px' weight={600} color='grey900'>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_1.title'
                    defaultMessage='Instead of timing the market, many smart investors use'
                  />
                </Text>
                <Text size='24px' weight={600} color='blue600' lineHeight='40px'>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_1.description'
                    defaultMessage='Dollar cost averaging'
                  />
                </Text>
              </SlideContent>
            </Slide>
            <SlideStart>
              <SlideContent>
                <Text size='24px' weight={600} color='grey900'>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_2.title'
                    defaultMessage='The strategy is pretty simple'
                  />
                </Text>
                <Text size='24px' weight={600} color='blue600' lineHeight='40px'>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_2.description'
                    defaultMessage='Invest the same amount every week'
                  />
                </Text>
              </SlideContent>
            </SlideStart>
            <SlideStart>
              <SlideContent>
                <Text size='24px' weight={600} color='grey900'>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_3.title'
                    defaultMessage='When the price goes down'
                  />
                </Text>
                <Text size='24px' weight={600} color='blue600' lineHeight='40px'>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_3.description'
                    defaultMessage='You’ll buy more crypto'
                  />
                </Text>
              </SlideContent>
            </SlideStart>
            <SlideStart>
              <SlideContent>
                <Text size='24px' weight={600} color='grey900'>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_4.title'
                    defaultMessage='When the price goes up'
                  />
                </Text>
                <Text size='24px' weight={600} color='blue600' lineHeight='40px'>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_4.description'
                    defaultMessage='You’ll buy less'
                  />
                </Text>
              </SlideContent>
            </SlideStart>
            <Slide>
              <SlideContent>
                <Text size='24px' weight={600} color='grey900' style={{ marginBottom: '40px' }}>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_5.title'
                    defaultMessage='But does it work?'
                  />
                </Text>
                <Text size='24px' weight={600} color='grey900' lineHeight='40px'>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_5.description'
                    defaultMessage='Over the past 5 years, buying Bitcoin every week performed better than timing the market'
                  />
                </Text>
                <Text size='24px' weight={600} color='blue600' lineHeight='40px'>
                  <FormattedMessage
                    id='modals.recurringbuys.notification.page_5.disclaimer'
                    defaultMessage='82% of the time.'
                  />
                </Text>
              </SlideContent>
            </Slide>
          </AnimatedCarousel>
        </MainContent>
        <FlyoutFooter>
          <Button
            nature='primary'
            data-e2e='setUpRecurringBuys'
            type='button'
            fullwidth
            height='48px'
            color='red400'
            style={{ marginTop: '16px' }}
            onClick={() => {
              this.props.simpleBuyActions.showModal('RecurringBuyPromo')
              this.props.modalActions.closeModal('RECURRING_BUYS_MODAL')
            }}
          >
            <FormattedMessage
              id='modals.recurringbuys.notification.button'
              defaultMessage='Setup recurring buy'
            />
          </Button>
        </FlyoutFooter>
      </Wrapper>
    )
  }
}

type OwnProps = {
  handleClose: () => void
}

type State = {
  stepIndex: number
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  recurringBuyActions: bindActionCreators(actions.components.recurringBuy, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Notifications)
