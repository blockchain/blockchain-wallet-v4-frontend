import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { prop } from 'ramda'
import { bindActionCreators, compose } from 'redux'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  Button,
  HeartbeatLoader,
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { actions, model, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

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
  margin-top: 18px;
  color: ${props => props.theme['grey800']};
`
const Copy = styled(Text)`
  margin-top: 16px;
  font-weight: 500;
  line-height: 1.6;
  max-width: 300px;
  color: ${props => props.theme['grey800']};
`
const FooterButton = styled(Button)`
  height: 56px;
  font-weight: 500;
  margin-top: 24px;
`

class AirdropClaim extends React.PureComponent {
  componentDidMount() {
    this.props.preferencesActions.hideAirdropClaimModal()
  }

  render() {
    const {
      actions,
      campaign,
      close,
      isCampaignTagged,
      position,
      submitting,
      total
    } = this.props
    return (
      <Modal
        size='small'
        position={position}
        total={total}
        dataE2e='infoModalAirdropClaim'
      >
        <AbsoluteModalHeader onClose={close} />
        <Body>
          <Image width='52px' name='gold-verified' />
          <Header>
            <FormattedMessage
              id='modals.airdropclaim.airdropprogram'
              defaultMessage='Airdrop Program'
            />
          </Header>
          {isCampaignTagged ? (
            <Copy>
              <FormattedMessage
                id='modals.airdropclaim.thanksforparticipatingairdropprogram'
                defaultMessage='Thanks for already joining our Airdrop Program. If you are eligible you should be receiving your {coinName} ({coinCode}) soon!'
                values={{
                  coinName: prop('coinName', CAMPAIGNS[campaign]),
                  coinCode: prop('coinCode', CAMPAIGNS[campaign])
                }}
              />
            </Copy>
          ) : (
            <Copy weight={400}>
              <FormattedMessage
                id='modals.airdropclaim.clicktojoinairdropprogram'
                defaultMessage='You’re eligible for our airdrop program. Click the button to join our Airdrop Program.'
              />
            </Copy>
          )}
          {!isCampaignTagged && (
            <FooterButton
              nature='primary'
              size='18px'
              fullwidth
              type='submit'
              disabled={submitting}
              onClick={() => actions.airdropClaimSubmitClicked(campaign)}
            >
              {submitting ? (
                <HeartbeatLoader height='20px' width='20px' color='white' />
              ) : (
                <FormattedMessage
                  defaultMessage='Join Airdrop Program'
                  id='modals.airdropclaim.joinairdropnow'
                />
              )}
            </FooterButton>
          )}
        </Body>
      </Modal>
    )
  }
}

AirdropClaim.defaultProps = {
  campaign: 'sunriver'
}

const mapStateToProps = state => ({
  isCampaignTagged: selectors.modules.profile
    .getSunRiverTag(state)
    .getOrElse(false)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.onboarding, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

const enhance = compose(
  modalEnhancer('AIRDROP_CLAIM_MODAL'),
  reduxForm({ form: 'airdropClaim' }),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(AirdropClaim)
