import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { getData } from './selectors'
import { Button, Image, Modal, Text } from 'blockchain-info-components'

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 435px;
  padding: 48px 32px 0 32px;
  box-sizing: border-box;
  text-align: center;
`
const Title = styled(Text)`
  margin-bottom: 8px;
  font-size: 20px;
  b {
    font-weight: 500;
    color: ${props => props.theme.success};
  }
`
const Message = styled(Text)`
  margin-bottom: 16px;
  font-size: 14px;
`
const BottomImage = styled(Image)`
  width: 100%;
  align-self: flex-end;
`
const FooterButton = styled(Button).attrs({
  nature: 'primary',
  fullwidth: true
})`
  height: auto;
  font-size: 17px;
  font-weight: 400;
  padding: 15px 0;
  margin-bottom: 32px;
`

class SwapUpgrade extends React.PureComponent {
  componentDidMount () {
    this.props.dontShowAgain()
  }

  render () {
    const {
      position,
      total,
      amountLeft,
      nextTier,
      nextTierAmount,
      upgrade
    } = this.props

    return (
      <Modal size='small' position={position} total={total}>
        <Body data-e2e='swapGetStarted'>
          <Title size='20px'>
            <FormattedHTMLMessage
              defaultMessage='Heads up! You have <b>{amount}</b> left to Swap'
              id='modals.swap_upgrade.heads_up'
              values={{
                amount: amountLeft
              }}
            />
          </Title>
          <Message>
            <FormattedMessage
              defaultMessage='Upgrade to Tier {tierIndex} and Swap up to {amount} every day.'
              id='modals.swap_upgrade.amount_after_upgrade'
              values={{
                tierIndex: nextTier,
                amount: nextTierAmount
              }}
            />
          </Message>
          <FooterButton
            nature='primary'
            size='20px'
            fullwidth
            onClick={upgrade}
          >
            <FormattedMessage
              defaultMessage='Upgrade Now'
              id='modals.swap_upgrade.upgrade_now'
            />
          </FooterButton>
          <BottomImage name='identity-verification' />
        </Body>
      </Modal>
    )
  }
}

const mapDispatchToProps = (dispatch, { nextTier }) => ({
  dontShowAgain: () => dispatch(actions.preferences.hideSwapUpgradeModal()),
  upgrade: () => {
    dispatch(actions.modals.closeModal())
    dispatch(actions.components.identityVerification.verifyIdentity(nextTier))
  }
})

export const ConnectedSwapUpgrade = connect(
  getData,
  mapDispatchToProps
)(SwapUpgrade)

export default modalEnhancer('SwapUpgrade')(ConnectedSwapUpgrade)
