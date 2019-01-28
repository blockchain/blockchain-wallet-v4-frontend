import React from 'react'
import styled from 'styled-components'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { actions, model } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { Button, Image, Modal, Text } from 'blockchain-info-components'
const { TIERS } = model.profile

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  margin: 30px 0;
  overflow: hidden;
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
  text-align: center;
  margin: 14px 0;

  & > :last-child {
    margin: 15px 0;
  }
`
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  padding: 0 10px;
`
const BottomImage = styled(Image)`
  width: 100%;
  margin: 20px 0 0;
`
const FooterButton = styled(Button)`
  height: 50px;
  width: 325px;
  padding: 0 10px;
  font-size: 18px;
`

class KycDocResubmit extends React.PureComponent {
  render () {
    const { position, total, verifyIdentity } = this.props

    return (
      <Modal size='small' position={position} total={total}>
        <Header>
          <Text size='20px' weight={400}>
            <FormattedMessage
              defaultMessage='Documents Needed'
              id='modals.exchange.docresubmit.title'
            />
          </Text>
        </Header>
        <Body>
          <Text size='14px' weight={300}>
            <FormattedMessage
              defaultMessage="We had some issues with the documents you've supplied."
              id='modals.exchange.docresubmit.body1'
            />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage
              defaultMessage='Please try uploading the documents again to continue with your verification.'
              id='modals.exchange.docresubmit.body2'
            />
          </Text>
        </Body>
        <Footer>
          <FooterButton nature='primary' onClick={verifyIdentity}>
            <FormattedMessage
              defaultMessage='Resubmit Now'
              id='modals.exchange.docresubmit.resubmit'
            />
          </FooterButton>
          <BottomImage name='identity-verification' />
        </Footer>
      </Modal>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  verifyIdentity: () =>
    dispatch(actions.components.identityVerification.verifyIdentity(TIERS[2]))
})

const enhance = compose(
  connect(
    null,
    mapDispatchToProps
  ),
  modalEnhancer('KycDocResubmit')
)

export default enhance(KycDocResubmit)
