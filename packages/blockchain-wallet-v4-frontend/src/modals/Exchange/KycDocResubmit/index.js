import React from 'react'
import styled from 'styled-components'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { Modal, Text, Button } from 'blockchain-info-components'

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  overflow: hidden;
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 120px;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
`
const Footer = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  padding: 0 24px 32px 24px;
  box-sizing: border-box;
`
const BottomImage = styled(Image)`
  width: 100%;
  align-self: flex-end;
`
const FooterButton = styled(Button).attrs({
  nature: 'primary',
  fullwidth: true
})`
  height: auto;
  font-size: 17px;
  font-weight: 400;
  padding: 15px 0;
  margin-bottom: 32px;
`

class DocResubmit extends React.PureComponent {
  componentDidMount () {
    this.props.actions.swapGetStartedInitialized()
  }

  render () {
    const { position, total, actions } = this.props

    return (
      <Modal size='small' position={position} total={total}>
        <Header>
          <Text color='white' size='24px' weight={500}>
            <FormattedMessage
              defaultMessage='Documents Needed'
              id='modals.exchange.docresubmit.title'
            />
          </Text>
        </Header>
        <Body>
          <Text size='18px' weight={400}>
            <FormattedMessage
              defaultMessage="We had some issues with the documents you've supplied."
              id='modals.exchange.docresubmit.body1'
            />
          </Text>
          <Text size='18px' weight={400}>
            <FormattedMessage
              defaultMessage='Please try uploading the documents again to continue with your verification.'
              id='modals.exchange.docresubmit.body2'
            />
          </Text>
        </Body>
        <Footer>
          <FooterButton
            nature='primary'
            size='20px'
            fullwidth
            onClick={actions.swapGetStartedSubmitClicked}
          >
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
  actions: bindActionCreators(actions.components.swapGetStarted, dispatch)
})

const enhance = compose(
  connect(
    null,
    mapDispatchToProps
  ),
  modalEnhancer('DocResubmit')
)

export default enhance(DocResubmit)
