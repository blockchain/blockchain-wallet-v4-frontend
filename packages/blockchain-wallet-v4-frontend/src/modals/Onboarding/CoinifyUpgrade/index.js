import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { actions } from 'data'
import {
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import modalEnhancer from 'providers/ModalEnhancer'

const AbsoluteModalHeader = styled(ModalHeader)`
  position: absolute;
  border: none;
  > span {
    &:hover {
      cursor: pointer;
    }
  }
  z-index: 99;
`
const Body = styled(ModalBody)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  margin-top: 24px;
`
const Header = styled(Text)`
  font-size: 24px;
  font-weight: 600;
  margin-top: 12px;
  color: ${props => props.theme['grey800']};
`
const Copy = styled(Text)`
  margin-top: 16px;
  font-weight: 500;
  line-height: 1.6;
  color: ${props => props.theme['grey800']};
`
const FooterButton = styled(Button)`
  height: 56px;
  font-weight: 500;
  margin-top: 24px;
`

class CoinifyUpgrade extends React.PureComponent {
  render () {
    const { position, total, close, actions } = this.props
    return (
      <Modal
        size='xsmall'
        position={position}
        total={total}
        dataE2e='infoModalCoinifyUpgrade'
      >
        <AbsoluteModalHeader onClick={close} />
        <Body>
          <Icon name='cart-filled' color='blue600' size='72px' />
          <Header>
            <FormattedMessage
              id='modals.coinifyupgrade.header'
              defaultMessage='Unlock Buy / Sell'
            />
          </Header>
          <Copy>
            <FormattedMessage
              id='modals.coinifyupgrade.coinifyupgradeairdropprogram'
              defaultMessage='Complete your profile to access Buy / Sell, and be eligible for our Airdrop Program.'
            />
          </Copy>
          <FooterButton
            nature='primary'
            size='18px'
            fullwidth
            onClick={() => actions.coinifyUpgradeSubmitClicked('sunriver')}
          >
            <FormattedMessage
              defaultMessage='Get Started'
              id='modals.coinifyupgrade.getstarted'
            />
          </FooterButton>
        </Body>
      </Modal>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.onboarding, dispatch)
})

const enhance = compose(
  modalEnhancer('CoinifyUpgrade'),
  connect(
    undefined,
    mapDispatchToProps
  )
)

export default enhance(CoinifyUpgrade)
