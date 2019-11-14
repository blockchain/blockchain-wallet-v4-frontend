import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import {
  Button,
  Icon,
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
  padding: 0px;
`
// TODO: STX, fix hardcoded background color
const Header = styled(Text)`
  width: 100%;
  font-size: 24px;
  font-weight: 600;
  border-radius: 8px 8px 0 0;
  padding: 45px 25px;
  background: #f4f4fe;
  box-sizing: border-box;
  color: ${props => props.theme['stx']};
`
const AirdropIcon = styled(Icon)`
  margin-bottom: 12px;
  justify-content: center;
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
  height: 56px;
  font-weight: 500;
  margin-top: 24px;
`
const Note = styled(Text)`
  margin-top: 12px;
`

class UpgradeForAirdrop extends React.PureComponent {
  componentDidMount () {
    this.props.preferencesActions.hideUpgradeForAirdropModal()
  }

  render () {
    const { campaign, position, total, close, actions } = this.props
    return (
      <Modal
        size='medium'
        position={position}
        total={total}
        dataE2e='infoModalUpgradeForAirdrop'
      >
        <AbsoluteModalHeader onClose={close} />
        <Body>
          <Header>
            <AirdropIcon name='stx' size='32px' color='stx' />
            <FormattedMessage
              id='modals.upgradeforairdrop.latestairdrop'
              defaultMessage='Our Latest Airdrop is Here.'
            />
            <br />
            <FormattedMessage
              id='modals.upgradeforairdrop.reserve'
              defaultMessage='Reserve Your Free Stacks'
            />
          </Header>
          <CopyContainer>
            <Copy>
              <FormattedMessage
                id='modals.upgradeforairdrop.goldprofilelevel'
                defaultMessage='Upgrade your profile to the Gold Level to be eligible for this and all future Airdrops.'
              />
            </Copy>
            <FooterButton
              nature='primary'
              size='18px'
              fullwidth
              onClick={() => actions.upgradeForAirdropSubmitClicked(campaign)}
            >
              <FormattedMessage
                defaultMessage='Complete Your Profile Now'
                id='modals.upgradeforairdrop.completeprofilenow'
              />
            </FooterButton>
            <Note size='12px' color='grey600'>
              <FormattedMessage
                id='modals.upgradeforairdrop.note'
                defaultMessage='*Note: Unfortunately, this airdrop is not available for US, Canada and Japanese passport holders.'
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
