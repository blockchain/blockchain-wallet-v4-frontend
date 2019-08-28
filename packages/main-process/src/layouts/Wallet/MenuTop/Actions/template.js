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
  width: auto;

  @media (min-width: 768px) {
    margin-top: 0;
  }
`
const ActionButton = styled(IconButton)`
  > span {
    color: ${props => props.theme['brand-primary']};
  }
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

const Actions = ({ showModal, sendAvailable, requestAvailable }) => (
  <Wrapper>
    <ActionButton
      name='send'
      disabled={!sendAvailable}
      onClick={() => showModal('SEND')}
      min='100px'
      data-e2e='sendButton'
      height='48px'
    >
      <ButtonText size='16px' weight={600} color='brand-primary'>
        <FormattedMessage
          id='layouts.wallet.menutop.send'
          defaultMessage='Send'
        />
      </ButtonText>
    </ActionButton>
    <ActionButton
      style={spacing('ml-15')}
      disabled={!requestAvailable}
      name='request'
      onClick={() => showModal('REQUEST')}
      min='100px'
      data-e2e='requestButton'
      height='48px'
    >
      <ButtonText size='16px' weight={600} color='brand-primary'>
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
  showModal: PropTypes.func.isRequired
}

export default Actions
