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
  font-weight: 300;
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
    setTimeout(() => {
      this.setState({ isLinkCopied: false })
    }, 3000)
  }

  hideCopied = () => {
    this.setState({ isLinkCopied: false })
  }

  render () {
    const { isLinkCopied } = this.state
    const { campaign, close, position, total } = this.props
    const link = 'https://www.blockchain.com/getcrypto/claim'
    const tweetLink =
      'https://twitter.com/intent/tweet?text=' +
      `I just claimed free ${prop('coinName', CAMPAIGNS[campaign])} ${prop(
        'coinCode',
        CAMPAIGNS[campaign]
      )} from @blockchain. Get Yours ${link}`
    const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${link}`

    return (
      <Modal size='small' position={position} total={total}>
        <AirdropSuccessModalHeader onClose={close} />
        <Image
          width='100%'
          name='get-free-crypto'
          srcset={{
            'get-free-crypto2': '2x',
            'get-free-crypto3': '3x'
          }}
        />
        <Body>
          <Text size='24px' weight={300}>
            <FormattedMessage
              id='modals.airdropsuccess.airdroponitsway'
              defaultMessage='Your {coinCode} is on its way!'
              values={{ coinCode: prop('coinCode', CAMPAIGNS[campaign]) }}
            />
          </Text>
          <Copy weight={300}>
            <FormattedMessage
              id='modals.airdropsuccess.sharethewealth'
              defaultMessage='Share the welath with friends and family. Literally.'
            />
          </Copy>
        </Body>
        <Footer>
          <Link href={tweetLink} rel='noopener noreferrer' target='_blank'>
            <FooterButton nature='primary' size='16px'>
              <FooterIcon name='twitter' size='18px' />
              <FormattedMessage
                defaultMessage='Tweet'
                id='modals.airdropsuccess.tweet'
              />
            </FooterButton>
          </Link>
          <Link href={facebookLink} rel='noopener noreferrer' target='_blank'>
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
  actions: bindActionCreators(actions.components.onboarding, dispatch)
})

const enhance = compose(
  connect(mapDispatchToProps),
  modalEnhancer('AirdropSuccess')
)

export default enhance(AirdropSuccess)
