import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'
import styled from 'styled-components'

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
  padding: 0;
`
const BgHeader = styled.div`
  width: 100%;
  height: 150px;
  background-image: url('/img/airdrop-welcome.png');
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 8px 8px 0 0;
  box-sizing: border-box;
`
const CopyHeader = styled(Text)`
  width: 100%;
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme['grey800']};
  margin-top: -20px;
  padding: 0 25px;
`
const CopyContainer = styled.div`
  padding: 25px 30px;
`
const Copy = styled(Text)`
  font-weight: 500;
  line-height: 1.6;
  max-width: 400px;
  color: ${props => props.theme['grey600']};
`
const FooterButton = styled(Button)`
  height: 46px;
  font-weight: 500;
  margin: 38px auto 0;
  width: 285px;
`
const Note = styled(Text)`
  margin: 32px 10px 12px;
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
          <BgHeader />
          <CopyHeader>
            <FormattedMessage
              id='modals.upgradeforairdrop.latestairdrop1'
              defaultMessage='Our Latest Airdrop is Here!'
            />
            <br />
            <FormattedMessage
              id='modals.upgradeforairdrop.unlock'
              defaultMessage='Unlock Access Today.'
            />
          </CopyHeader>
          <CopyContainer>
            <Copy size='16px'>
              <FormattedMessage
                id='modals.upgradeforairdrop.goldprofilelevel1'
                defaultMessage='Upgrade your profile to Gold Level to secure your spot in our next airdrop with Blockstack and get free Stacks (STX).'
              />
            </Copy>
            <FooterButton
              nature='primary'
              size='16px'
              onClick={() => actions.upgradeForAirdropSubmitClicked(campaign)}
            >
              <FormattedMessage
                defaultMessage='Complete My Profile Now'
                id='modals.upgradeforairdrop.completeprofile'
              />
            </FooterButton>
            <Note size='12px' color='grey600'>
              <FormattedMessage
                id='modals.upgradeforairdrop.regulations'
                defaultMessage="*For regulatory reasons, USA, Canada and Japan nationals can't participate in the airdrop."
              />
            </Note>
          </CopyContainer>
        </Body>
      </Modal>
    )
  }
}

UpgradeForAirdrop.defaultProps = {
  campaign: 'BLOCKSTACK'
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
