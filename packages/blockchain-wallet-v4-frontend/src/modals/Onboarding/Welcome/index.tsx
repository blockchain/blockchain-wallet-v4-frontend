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

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
`
const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;

  span {
    margin-left: 8px;
  }
`
const ContentContainer = styled(Column)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 70px;
  padding: 40px;
  text-align: center;
`
const IconBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  min-width: 48px;
  background-color: ${props => props.theme.blue000};
  border-radius: 48px;
`

const Title = styled(Text)`
  margin: 26px 0 13px;
`

const ContentTextWrapper = styled(Text)`
  margin-bottom: 50px;
`
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 5px;
  & > :first-child {
    margin-bottom: 15px;
  }
`

class WelcomeContainer extends React.PureComponent<Props> {
  state = { show: false }

  componentDidMount () {
    this.setState({ show: true }) //eslint-disable-line
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  handleSBClick = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
      this.props.simpleBuyActions.showModal('welcomeModal')
    }, duration / 2)
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
        direction='left'
      >
        <CustomFlyoutWrapper>
          <Header>
            <Image name='intro-hand' width='28px' height='28px' />
            <Text color='grey600' size='20px' weight={600}>
              <FormattedMessage
                id='modals.wallet.tour.wallet.tour'
                defaultMessage='Welcome to Blockchain!'
              />
            </Text>
          </Header>
          <ContentContainer>
            <IconBackground>
              <Icon color='blue600' name='cart-filled' size='25px' />
            </IconBackground>
            <Title size='20px' weight={600}>
              <FormattedMessage
                id='modals.wallet.welcome.sb.title'
                defaultMessage='Own Crypto in a Few Minutes'
              />
            </Title>
            <ContentTextWrapper color='grey600' size='14x' weight={500}>
              <FormattedMessage
                id='modals.wallet.welcome.sb.verifybuy'
                defaultMessage='Verify your identity and buy crypto.'
              />
            </ContentTextWrapper>
            <Image name='buy-wallet' width='282px' height='165px' />
          </ContentContainer>
          <ButtonWrapper>
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
            <Button
              capitalize
              data-e2e='toWalletTour'
              fullwidth
              height='48px'
              nature='light'
              onClick={this.handleClose}
              size='16px'
            >
              <FormattedMessage
                id='modals.wallet.welcome.sb.skip'
                defaultMessage='Skip'
              />
            </Button>
          </ButtonWrapper>
        </CustomFlyoutWrapper>
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
