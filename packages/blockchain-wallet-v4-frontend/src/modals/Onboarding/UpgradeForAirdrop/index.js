import React from 'react'
import styled from 'styled-components'
import { prop } from 'ramda'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { actions, model } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'

const { CAMPAIGNS } = model.components.identityVerification

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
  color: ${props => props.theme['gray-6']};
`
const Copy = styled(Text)`
  margin-top: 16px;
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

class UpgradeForAirdrop extends React.PureComponent {
  componentDidMount () {
    this.props.preferencesActions.hideUpgradeForAirdropModal()
  }

  render () {
    const { campaign, position, total, close, actions } = this.props
    return (
      <Modal size='small' position={position} total={total}>
        <AbsoluteModalHeader onClose={close} />
        <Body>
          <Image name='gold-verified' />
          <Header>
            <FormattedMessage
              id='modals.upgradeforairdrop.goforgold'
              defaultMessage='Go for Gold'
            />
          </Header>
          <Copy weight={400}>
            <FormattedMessage
              id='modals.upgradeforairdrop.completeprofileforairdropfree'
              defaultMessage='Upgrade your profile from Silver to Gold, raise your trading limits and get free {coinName} ({coinCode}).'
              values={{
                coinName: prop('coinName', CAMPAIGNS[campaign]),
                coinCode: prop('coinCode', CAMPAIGNS[campaign])
              }}
            />
          </Copy>
        </Body>
        <Footer>
          <FooterButton
            nature='primary'
            size='18px'
            fullwidth
            onClick={() => actions.upgradeForAirdropSubmitClicked(campaign)}
          >
            <FormattedMessage
              defaultMessage='Upgrade Now'
              id='modals.upgradeforairdrop.upgradenow'
            />
          </FooterButton>
          <LaterButton
            nature='primary'
            size='18px'
            fullwidth
            onClick={close}
            data-e2e='remindMeLaterButton'
          >
            <FormattedMessage
              defaultMessage='Remind Me Later'
              id='modals.upgradeforairdrop.later'
            />
          </LaterButton>
        </Footer>
      </Modal>
    )
  }
}

UpgradeForAirdrop.defaultProps = {
  campaign: 'sunriver'
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
  modalEnhancer('UpgradeForAirdrop')
)

export default enhance(UpgradeForAirdrop)
