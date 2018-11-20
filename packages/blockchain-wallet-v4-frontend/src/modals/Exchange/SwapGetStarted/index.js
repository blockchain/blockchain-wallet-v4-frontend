import React from 'react'
import styled from 'styled-components'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import background from './swap-background-2.svg'
import modalEnhancer from 'providers/ModalEnhancer'
import { Modal, Text, Button } from 'blockchain-info-components'

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: #0d0d42;
  background: #0d0d42 url(${background});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: -20px -10px;
  overflow: hidden;
  border-radius: 4px;
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
const FooterButton = styled(Button).attrs({
  nature: 'primary',
  size: '20px',
  fullwidth: true
})`
  height: auto;
  font-weight: 500;
  padding: 15px 0;
`

class SwapGetStarted extends React.PureComponent {
  componentDidMount () {
    this.props.actions.swapGetStartedInitialized()
  }

  render () {
    const { position, total, actions } = this.props

    return (
      <Modal size='small' position={position} total={total}>
        <Header>
          <Text color='white' size='24px' weight={500} uppercase>
            <FormattedMessage
              defaultMessage="We've improved"
              id='modals.swapgetstarted.improved'
            />
          </Text>
          <Text color='white' size='24px' weight={500} uppercase>
            <FormattedMessage
              defaultMessage='your Exchange'
              id='modals.swapgetstarted.exchange'
            />
          </Text>
        </Header>
        <Body>
          <Text size='18px' weight={400}>
            <FormattedMessage
              defaultMessage='The faster, smarter way to trade your crypto. Check it out!'
              id='modals.swapgetstarted.description'
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
              defaultMessage='Get Started'
              id='modals.swapgetstarted.getstarted'
            />
          </FooterButton>
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
    undefined,
    mapDispatchToProps
  ),
  modalEnhancer('SwapGetStarted')
)

export default enhance(SwapGetStarted)
