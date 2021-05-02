import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'

import {
  Button,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalHeader,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

const AbsoluteModalHeader = styled(ModalHeader)`
  position: absolute;
  border: none;
  top: 3px;
  right: -6px;
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
  /* stylelint-disable */
  background-image: -webkit-image-set(
    url('/img/airdrop-welcome.png') 1x,
    url('/img/airdrop-welcome@2x.png') 2x
  );
  /* stylelint-enable */
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 8px 8px 0 0;
  box-sizing: border-box;
`
const TitleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  margin-top: -100px;
  padding: 0;
`
const AirdropIcon = styled(Icon)`
  margin-bottom: 30px;
`
const CopyHeader = styled(Text)`
  width: 100%;
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.grey800};
  padding: 0 25px;
`
const CopyContainer = styled.div`
  padding: 25px 34px;
`
const Copy = styled(Text)`
  font-weight: 500;
  line-height: 1.6;
  max-width: 400px;
  color: ${props => props.theme.grey600};
`
const FooterButton = styled(Button)`
  height: 46px;
  font-weight: 600;
  margin: 38px auto 0;
  width: 285px;
  border-radius: 8px;
  background-color: ${props => props.theme.green600};
  border: none;
  color: white;
  &:hover {
    background-color: ${props => props.theme.green700};
  }
`
const FooterTextGroup = styled(TextGroup)`
  margin: 22px 10px 12px;
`
const LearnMoreLink = styled(Link)`
  display: inline-flex;
`

class UpgradeForAirdrop extends React.PureComponent {
  componentDidMount() {
    this.props.preferencesActions.hideUpgradeForAirdropModal()
  }

  render() {
    const { actions, campaign, close, position, total } = this.props
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
          <TitleHeader>
            <AirdropIcon name='parachute' color='green600' size='40px' />
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
          </TitleHeader>
          <CopyContainer>
            <Copy size='16px'>
              <FormattedMessage
                id='modals.upgradeforairdrop.goldprofilelevel1'
                defaultMessage='Upgrade your profile to Gold Level to secure your spot in our next airdrop with Blockstack and get free Stacks (STX).'
              />
            </Copy>
            <FooterButton
              onClick={() => actions.upgradeForAirdropSubmitClicked(campaign)}
              size='16px'
            >
              <FormattedMessage
                defaultMessage='Complete My Profile Now'
                id='modals.upgradeforairdrop.completeprofile'
              />
            </FooterButton>
            <FooterTextGroup inline>
              <Text size='12px' color='grey600'>
                <FormattedMessage
                  id='modals.upgradeforairdrop.regulations'
                  defaultMessage="*For regulatory reasons, USA, Canada and Japan nationals can't participate in the airdrop."
                />
              </Text>
              <LearnMoreLink
                href='https://support.blockchain.com/hc/en-us/articles/360035793932-How-to-participate-in-the-Blockstack-Airdrop'
                size='12px'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FormattedMessage
                  id='buttons.learn_more'
                  defaultMessage='Learn More'
                />
              </LearnMoreLink>
            </FooterTextGroup>
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
  connect(undefined, mapDispatchToProps),
  modalEnhancer('UPGRADE_FOR_AIRDROP_MODAL')
)

export default enhance(UpgradeForAirdrop)
