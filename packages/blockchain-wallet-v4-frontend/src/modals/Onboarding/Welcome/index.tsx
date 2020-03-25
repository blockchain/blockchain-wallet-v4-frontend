import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Flyout, { duration, FlyoutWrapper } from 'components/Flyout'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'
import styled from 'styled-components'

type OwnPropsType = {
  close: () => void
  position: number
  total: number
  userClickedOutside: boolean
}

type LinkDispatchPropsType = {
  onboardingActions: typeof actions.components.onboarding
  simpleBuyActions: typeof actions.components.simpleBuy
}

type Props = OwnPropsType & LinkDispatchPropsType

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 22px;

  span {
    margin-left: 8px;
  }
`

const HeaderDesc = styled(Text)`
  margin-bottom: 56px;
`

const Card = styled(Column)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 40px;
  padding: 40px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.grey100};
  border-radius: 16px;
`

const Title = styled(Text)`
  margin: 26px 0 13px;
`

const Content = styled(Text)`
  margin-bottom: 24px;
  width: 240px;
  text-align: center;
`

class WelcomeContainer extends React.PureComponent<Props> {
  state = { show: false }

  componentDidMount () {
    this.setState({ show: true }) //eslint-disable-line
  }

  handleSBClick = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
      this.props.simpleBuyActions.showModal()
    }, duration)
  }

  handleTourClick = () => {
    const { takeWalletTourClicked } = this.props.onboardingActions
    takeWalletTourClicked()
  }

  render () {
    const { show } = this.state
    const { ...rest } = this.props
    return (
      <Flyout
        {...rest}
        onClose={this.props.close}
        in={show}
        data-e2e='welcomeModal'
      >
        <FlyoutWrapper>
          <Header>
            <Image name='intro-hand' width='28px' height='28px' />
            <Text color='grey800' size='20px' weight={600}>
              <FormattedMessage
                id='modals.wallet.tour.wallet.tour'
                defaultMessage='Welcome to Blockchain!'
              />
            </Text>
          </Header>
          <HeaderDesc weight={500}>
            <FormattedMessage
              id='modals.wallet.welcome.desc'
              defaultMessage='Let’s get your wallet set up. You can quickly buy crypto now or do this later.'
            />
          </HeaderDesc>
          <Card>
            <Icon color='blue600' name='cart-filled' size='32px' />
            <Title lineHeight='30px' size='20px' weight={600}>
              <FormattedMessage
                id='modals.wallet.welcome.sb.title'
                defaultMessage='Buy Crypto'
              />
            </Title>
            <Content lineHeight='24px' weight={500}>
              <FormattedMessage
                id='modals.wallet.welcome.sb.content'
                defaultMessage='We can help you buy in just a few simple steps'
              />
            </Content>
            <Button
              capitalize
              data-e2e='toSimpleBuyModal'
              fullwidth
              height='48px'
              nature='primary'
              onClick={this.handleSBClick}
              size='16px'
            >
              <FormattedMessage
                id='modals.wallet.welcome.sb.button'
                defaultMessage='Buy Crypto Now'
              />
            </Button>
          </Card>
          <Card>
            <Icon color='blue600' name='wallet-filled' size='32px' />
            <Title lineHeight='30px' size='20px' weight={600}>
              <FormattedMessage
                id='modals.wallet.welcome.tour.title'
                defaultMessage='Tour the Wallet'
              />
            </Title>
            <Content lineHeight='24px' weight={500}>
              <FormattedMessage
                id='modals.wallet.welcome.tour.content'
                defaultMessage='Explore your new Blockchain Wallet.'
              />
            </Content>
            <Button
              capitalize
              data-e2e='toWalletTour'
              fullwidth
              height='48px'
              nature='grey800'
              onClick={this.handleTourClick}
              size='16px'
            >
              <FormattedMessage
                id='modals.wallet.welcome.tour.button'
                defaultMessage='Get Started'
              />
            </Button>
          </Card>
        </FlyoutWrapper>
      </Flyout>
    )
  }
}

const mapDispatchToProps = (dispatch): LinkDispatchPropsType => ({
  onboardingActions: bindActionCreators(
    actions.components.onboarding,
    dispatch
  ),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const enhance = compose<any>(
  modalEnhancer('WELCOME_MODAL', { transition: duration }),
  connect(
    null,
    mapDispatchToProps
  )
)

export default enhance(WelcomeContainer)
