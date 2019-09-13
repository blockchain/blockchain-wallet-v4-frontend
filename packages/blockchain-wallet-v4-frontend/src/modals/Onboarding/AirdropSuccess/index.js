import React from 'react'
import styled from 'styled-components'
import { prop } from 'ramda'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import CopyToClipBoard from 'react-copy-to-clipboard'

import { actions, model } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import {
  Button,
  Icon,
  Image,
  Link,
  Modal,
  ModalHeader,
  Text,
  TooltipHost
} from 'blockchain-info-components'

const { CAMPAIGNS } = model.components.identityVerification
const { SUNRIVER_AIRDROP_EVENTS } = model.analytics

const AirdropSuccessModalHeader = styled(ModalHeader)`
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
const AirdropImage = styled(Image)`
  border-radius: 8px 8px 0 0;
`
const Copy = styled(Text)`
  margin-top: 16px;
`
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: auto;
  padding: 0 24px 32px 24px;
  box-sizing: border-box;
`
const FooterButton = styled(Button)`
  height: 48px;
  font-weight: 400;
  min-width: auto;
  padding: 14px;
`
const FooterIcon = styled(Icon).attrs({
  color: 'white'
})`
  margin-right: 12px;
`

class AirdropSuccess extends React.PureComponent {
  state = { isLinkCopied: false }

  handleCopy = () => {
    this.setState({ isLinkCopied: true })
    this.logShareEvent('copy_link')
    setTimeout(() => {
      this.setState({ isLinkCopied: false })
    }, 3000)
  }

  hideCopied = () => {
    this.setState({ isLinkCopied: false })
  }

  logShareEvent = type => {
    this.props.analyticsActions.logEvent([
      ...SUNRIVER_AIRDROP_EVENTS.SOCIAL_SHARE,
      type
    ])
  }

  render () {
    const { isLinkCopied } = this.state
    const { campaign, close, position, total } = this.props
    const link = 'https://www.blockchain.com/getcrypto'
    const tweetLink =
      'https://twitter.com/intent/tweet?text=' +
      `I just enrolled in @blockchain's Airdrop Program so that I'm ready for their next %23crypto airdrop. Click below to learn more 👇 ${link}`
    const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${link}`
    return (
      <Modal
        size='small'
        position={position}
        total={total}
        dataE2e='infoModalAirdropSuccess'
      >
        <AirdropSuccessModalHeader onClose={close} />
        <AirdropImage width='100%' name='airdrop-enrolled' />
        <Body>
          <Text size='24px' weight={400}>
            <FormattedMessage
              id='modals.airdropsuccess.airdropprogram'
              defaultMessage='Enrolled in Airdrop Program!'
              values={{ coinCode: prop('coinCode', CAMPAIGNS[campaign]) }}
            />
          </Text>
          <Copy weight={400}>
            <FormattedMessage
              id='modals.airdropsuccess.sharethewealth'
              defaultMessage='Share the wealth with friends and family. Literally.'
            />
          </Copy>
        </Body>
        <Footer>
          <Link
            href={tweetLink}
            rel='noopener noreferrer'
            target='_blank'
            onClick={() => this.logShareEvent('twitter')}
          >
            <FooterButton nature='primary' size='16px'>
              <FooterIcon name='twitter' size='18px' />
              <FormattedMessage
                defaultMessage='Tweet'
                id='modals.airdropsuccess.tweet'
              />
            </FooterButton>
          </Link>
          <Link
            href={facebookLink}
            rel='noopener noreferrer'
            target='_blank'
            onClick={() => this.logShareEvent('facebook')}
          >
            <FooterButton nature='secondary' size='16px'>
              <FooterIcon name='facebook' size='18px' />
              <FormattedMessage
                defaultMessage='Share'
                id='modals.airdropsuccess.share'
              />
            </FooterButton>
          </Link>
          <CopyToClipBoard text={link} onCopy={this.handleCopy}>
            {isLinkCopied ? (
              <TooltipHost id='copied'>
                <FooterButton
                  nature='purple'
                  size='16px'
                  onMouseLeave={this.hideCopied}
                >
                  <FooterIcon name='copy' size='12px' />
                  <FormattedMessage
                    defaultMessage='Copy'
                    id='modals.airdropsuccess.copy'
                  />
                </FooterButton>
              </TooltipHost>
            ) : (
              <FooterButton nature='purple' size='16px'>
                <FooterIcon name='copy' size='12px' />
                <FormattedMessage
                  defaultMessage='Copy'
                  id='modals.airdropsuccess.copy'
                />
              </FooterButton>
            )}
          </CopyToClipBoard>
        </Footer>
      </Modal>
    )
  }
}

AirdropSuccess.defaultProps = {
  campaign: 'sunriver'
}

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  actions: bindActionCreators(actions.components.onboarding, dispatch)
})

const enhance = compose(
  modalEnhancer('AirdropSuccess'),
  connect(
    null,
    mapDispatchToProps
  )
)

export default enhance(AirdropSuccess)
