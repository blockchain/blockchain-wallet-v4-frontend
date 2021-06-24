import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'

import { Button, Image, Modal, Text } from 'blockchain-info-components'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  margin: 30px 0 10px;
  overflow: hidden;
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  text-align: center;
  margin: 4px 0 14px;

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
  width: 340px;
  padding: 0 10px;
  font-size: 18px;
`

class KycDocResubmit extends React.PureComponent {
  onVerifyIdentity = () => {
    this.props.closeModal()
    this.props.verifyIdentity()
  }

  render() {
    const { position, total } = this.props

    return (
      <Modal size='small' position={position} total={total}>
        <Header>
          <Text size='20px' weight={500}>
            <FormattedMessage
              defaultMessage='Documents Needed'
              id='modals.exchange.docresubmit.title'
            />
          </Text>
        </Header>
        <Body>
          <Text size='14px' weight={400}>
            <FormattedMessage
              defaultMessage="We had some issues with the documents you've supplied. Please try uploading the documents again to continue with your verification."
              id='modals.exchange.docresubmit.body1'
            />
          </Text>
        </Body>
        <Footer>
          <FooterButton nature='primary' onClick={this.onVerifyIdentity}>
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

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(actions.modals.closeModal()),
  verifyIdentity: () =>
    dispatch(
      actions.components.identityVerification.verifyIdentity({ origin: 'Resubmission', tier: 2 })
    )
})

const enhance = compose(connect(null, mapDispatchToProps), modalEnhancer('KYC_RESUBMIT_MODAL'))

export default enhance(KycDocResubmit)
