import React from 'react'
import styled from 'styled-components'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'

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
  font-weight: 500;
  line-height: 1.6;
  max-width: 300px;
  color: ${props => props.theme['gray-6']};
`
const FooterButton = styled(Button)`
  height: 56px;
  font-weight: 500;
  margin-top: 24px;
`

class UpgradeForAirdrop extends React.PureComponent {
  componentDidMount () {
    this.props.preferencesActions.hideUpgradeForAirdropModal()
  }

  render () {
    const { campaign, position, total, close, actions } = this.props
    return (
      <Modal
        size='small'
        position={position}
        total={total}
        dataE2e='infoModalUpgradeForAirdrop'
      >
        <AbsoluteModalHeader onClose={close} />
        <Body>
          <Image width='52px' name='gold-verified' />
          <Header>
            <FormattedMessage
              id='modals.upgradeforairdrop.goforgold'
              defaultMessage='Go for Gold'
            />
          </Header>
          <Copy>
            <FormattedMessage
              id='modals.upgradeforairdrop.completeprofileforairdropprogram'
              defaultMessage='Complete your profile to start instantly trading crypto from the security of your wallet and become eligible for our Airdrop Program.'
            />
          </Copy>
          <FooterButton
            nature='primary'
            size='18px'
            fullwidth
            onClick={() => actions.upgradeForAirdropSubmitClicked(campaign)}
          >
            <FormattedMessage
              defaultMessage='Complete Profile'
              id='modals.upgradeforairdrop.completeprofile'
            />
          </FooterButton>
        </Body>
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
