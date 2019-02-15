import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import {
  Button,
  Icon,
  Modal,
  ModalBody,
  Text
} from 'blockchain-info-components'
import modalEnhancer from 'providers/ModalEnhancer'

const Container = styled.div`
  text-align: center;
`
const Copy = styled(Text)`
  margin: 24px 0;
`
const JumboIcon = styled(Icon)`
  text-align: center;
  margin-top: 32px;
  display: flex;
  justify-content: center;
`

class BsvGetStarted extends React.PureComponent {
  render () {
    const { position, total } = this.props
    return (
      <Modal size='small' position={position} total={total}>
        <ModalBody>
          <Container>
            <Text color='black' size='18px'>
              <FormattedMessage
                defaultMessage='Now Supporting Bitcoin SV (BSV)'
                id='modals.bsvgetstarted.now_supporting_sv'
              />
            </Text>
            <Copy color='gray-5' size='14px' weight={300}>
              <FormattedMessage
                defaultMessage='Visit Settings to view your balance, exchange BSV for BTC, BCH, ETH, and XLM, or send BSV to any address.'
                id='modals.bsvgetstarted.visitsettings'
              />
            </Copy>
            <LinkContainer to='/settings/addresses/bsv'>
              <Button
                jumbo
                fullwidth
                nature='primary'
                data-e2e='bsvGetStartedButton'
              >
                <FormattedMessage
                  id='modals.bsvGetStarted.continue'
                  defaultMessage='Check It Out!'
                />
              </Button>
            </LinkContainer>
            <JumboIcon name='bsv' color='bsv' size='124px' />
          </Container>
        </ModalBody>
      </Modal>
    )
  }
}

export default modalEnhancer('BsvGetStarted')(BsvGetStarted)
