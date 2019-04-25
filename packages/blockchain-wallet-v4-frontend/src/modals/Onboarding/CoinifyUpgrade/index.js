import React from 'react'
import styled from 'styled-components'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { Button, Image, Modal, Text } from 'blockchain-info-components'

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  box-sizing: border-box;
  text-align: center;
`
const Copy = styled(Text)`
  margin-top: 16px;
`
const UpgradeImage = styled(Image)`
  display: block;
  width: 100%;
  margin-top: 24px;
`
const Footer = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  padding: 0 24px;
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

class CoinifyUpgrade extends React.PureComponent {
  render () {
    const { position, total, close, actions } = this.props
    return (
      <Modal size='small' position={position} total={total}>
        <Body>
          <Copy weight={400}>
            <FormattedMessage
              id='modals.coinifyupgrade.completeprofilenowforfree'
              defaultMessage='Please take a few minutes to complete your profile to continue accessing Buy/Sell, AND get $50 of free Stellar (XLM).'
            />
          </Copy>
        </Body>
        <Footer>
          <FooterButton
            nature='primary'
            size='18px'
            fullwidth
            onClick={() => actions.coinifyUpgradeSubmitClicked('sunriver')}
          >
            <FormattedMessage
              defaultMessage='Complete My Profile Now'
              id='modals.coinifyupgrade.completeprofile'
            />
          </FooterButton>
          <UpgradeImage name='identity-verification' />
          <LaterButton
            nature='primary'
            size='18px'
            fullwidth
            onClick={close}
            data-e2e='remindMeLaterButton'
          >
            <FormattedMessage
              defaultMessage='Remind Me Later'
              id='modals.coinifyupgrade.later'
            />
          </LaterButton>
        </Footer>
      </Modal>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.onboarding, dispatch)
})

const enhance = compose(
  connect(
    undefined,
    mapDispatchToProps
  ),
  modalEnhancer('CoinifyUpgrade')
)

export default enhance(CoinifyUpgrade)
