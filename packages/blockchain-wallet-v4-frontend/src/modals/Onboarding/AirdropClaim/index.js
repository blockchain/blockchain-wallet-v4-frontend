import React from 'react'
import styled from 'styled-components'
import { prop } from 'ramda'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'

import { actions, model, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import {
  Button,
  HeartbeatLoader,
  Image,
  Modal,
  ModalHeader,
  Text
} from 'blockchain-info-components'

const { CAMPAIGNS } = model.components.identityVerification

const AirdropClaimModalHeader = styled(ModalHeader)`
  position: absolute;
  border: 0;
  > span {
    color: ${props => props.theme['gray-1']};
  }
`
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

class AirdropClaim extends React.PureComponent {
  componentDidMount () {
    this.props.preferencesActions.hideAirdropClaimModal()
  }

  render () {
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
      <Modal size='small' position={position} total={total}>
        <AirdropClaimModalHeader onClose={close} />
        <Image
          width='100%'
          name='get-free-crypto'
          srcset={{
            'get-free-crypto2': '2x',
            'get-free-crypto3': '3x'
          }}
        />
        <Body>
          <Text size='24px' weight={400}>
            <FormattedMessage
              id='modals.airdropclaim.getfreecrypto'
              defaultMessage='Get Free Crypto'
            />
          </Text>
          {isCampaignTagged ? (
            <Copy weight={400}>
              <FormattedMessage
                id='modals.airdropclaim.thanksforparticipating'
                defaultMessage='Thanks for claiming your airdrop. You should be receiving your {coinName} ({coinCode}) soon!'
                values={{
                  coinName: prop('coinName', CAMPAIGNS[campaign]),
                  coinCode: prop('coinCode', CAMPAIGNS[campaign])
                }}
              />
            </Copy>
          ) : (
            <Copy weight={400}>
              <FormattedMessage
                id='modals.airdropclaim.completeprofilefree'
                defaultMessage='Congrats! You are eligible for our airdrop program. We are giving away {coinName} ({coinCode}) for free. Click the button and we will send it your way.'
                values={{
                  coinName: prop('coinName', CAMPAIGNS[campaign]),
                  coinCode: prop('coinCode', CAMPAIGNS[campaign])
                }}
              />
            </Copy>
          )}
        </Body>
        {!isCampaignTagged && (
          <Footer>
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
                  defaultMessage='Claim My Free {coinCode} Now'
                  id='modals.airdropclaim.claimnow'
                  values={{
                    coinCode: prop('coinCode', CAMPAIGNS[campaign])
                  }}
                />
              )}
            </FooterButton>
            <LaterButton nature='primary' size='18px' fullwidth onClick={close}>
              <FormattedMessage
                defaultMessage='Remind Me Later'
                id='modals.airdropclaim.later'
              />
            </LaterButton>
          </Footer>
        )}
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({ form: 'airdropClaim' }),
  modalEnhancer('AirdropClaim')
)

export default enhance(AirdropClaim)
