import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text, IconButton } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-top: 10px;
  width: auto;
  margin-top: 8px;

  @media (min-width: 768px) {
    margin-top: 0px;
  }
`

const Actions = props => {
  const { handleSend, handleRequest } = props

  return (
    <Wrapper>
      <IconButton name='send-filled' onClick={handleSend} min='100px'>
        <Text size='14px' weight={400}>
          <FormattedMessage id='layouts.wallet.menutop.send' defaultMessage='Send' />
        </Text>
      </IconButton>
      <IconButton style={spacing('ml-15')} name='request-filled' onClick={handleRequest} min='100px'>
        <Text size='14px' weight={400}>
          <FormattedMessage id='layouts.wallet.menutop.request' defaultMessage='Request' />
        </Text>
      </IconButton>
    </Wrapper>
  )
}

Actions.propTypes = {
  handleSend: PropTypes.func.isRequired,
  handleRequest: PropTypes.func.isRequired
}

export default Actions
