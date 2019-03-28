import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text, IconButton } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'
import media from 'services/ResponsiveService'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-top: 10px;
  width: auto;
  margin-top: 8px;

  @media (min-width: 768px) {
    margin-top: 0;
  }
`
const ActionButton = styled(IconButton)`
  ${media.mobile`
    padding: 10px 10px;
    div:last-of-type {
      font-size: 13px;
    }
  `};
`

const ButtonText = styled(Text)`
  margin-left: 6px;
`

const Actions = ({
  handleSend,
  handleRequest,
  sendAvailable,
  requestAvailable
}) => (
  <Wrapper>
    <ActionButton
      name='paper-airplane-filled'
      disabled={!sendAvailable}
      onClick={handleSend}
      min='100px'
      data-e2e='sendButton'
      nature='gray-3'
      height='36px'
    >
      <ButtonText size='13px' weight={400} color='gray-5'>
        <FormattedMessage
          id='layouts.wallet.menutop.send'
          defaultMessage='Send'
        />
      </ButtonText>
    </ActionButton>
    <ActionButton
      style={spacing('ml-15')}
      disabled={!requestAvailable}
      name='download-filled'
      onClick={handleRequest}
      min='100px'
      data-e2e='requestButton'
      nature='gray-3'
      height='36px'
    >
      <ButtonText size='13px' weight={400} color='gray-5'>
        <FormattedMessage
          id='layouts.wallet.menutop.request'
          defaultMessage='Request'
        />
      </ButtonText>
    </ActionButton>
  </Wrapper>
)

Actions.propTypes = {
  sendAvailable: PropTypes.bool.isRequired,
  requestAvailable: PropTypes.bool.isRequired,
  handleSend: PropTypes.func.isRequired,
  handleRequest: PropTypes.func.isRequired
}

export default Actions
