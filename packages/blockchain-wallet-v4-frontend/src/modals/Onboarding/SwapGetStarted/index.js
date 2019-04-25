import React from 'react'
import styled from 'styled-components'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { Modal, Text, Button } from 'blockchain-info-components'

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: #0d0d42;
  background: #0d0d42 url(/img/swap-dashboard-right.png);
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
  border-radius: 4px;
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 36px 24px;
  box-sizing: border-box;
  text-align: center;
`
const Footer = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  padding: 0 24px 32px 24px;
  box-sizing: border-box;
`
const FooterButton = styled(Button)`
  height: auto;
  font-weight: 400;
  padding: 15px 0;
`
const LaterButton = styled(FooterButton)`
  position: absolute;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  top: calc(100% + 9px);
  width: calc(100% - 48px);
  &:hover {
    background-color: rgba(0, 0, 0, 0);
    border: none;
  }
`
const CenteredText = styled(Text)`
  padding: 0 36px;
  text-align: center;
  text-shadow: 0px 0px 1px #0d0d42;
`

class SwapGetStarted extends React.PureComponent {
  componentDidMount () {
    this.props.preferencesActions.hideKycGetStarted()
  }

  render () {
    const { position, total, close, actions } = this.props
    return (
      <Modal size='small' position={position} total={total}>
        <Header>
          <CenteredText color='white' size='20px' weight={500}>
            <FormattedMessage
              defaultMessage="Trading your crypto doesn't mean trading away control."
              id='modals.swapgetstarted.trading_your_crypto'
            />
          </CenteredText>
        </Header>
        <Body data-e2e='swapGetStarted'>
          <Text size='16x' weight={400}>
            <FormattedMessage
              defaultMessage='A Swap by Blockchain enables you to trade crypto with best prices and quick settlement, all while maintaining full control of your funds.'
              id='modals.swapgetstarted.description'
            />
          </Text>
        </Body>
        <Footer>
          <FooterButton
            nature='primary'
            size='18px'
            fullwidth
            onClick={actions.swapGetStartedSubmitClicked}
          >
            <FormattedMessage
              defaultMessage='Get Started'
              id='modals.swapgetstarted.getstarted'
            />
          </FooterButton>
          <LaterButton nature='primary' size='18px' fullwidth onClick={close}>
            <FormattedMessage
              defaultMessage="I'll do this later"
              id='modals.swapgetstarted.later'
            />
          </LaterButton>
        </Footer>
      </Modal>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.onboarding, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

const enhance = compose(
  connect(
    undefined,
    mapDispatchToProps
  ),
  modalEnhancer('SwapGetStarted')
)

export default enhance(SwapGetStarted)
