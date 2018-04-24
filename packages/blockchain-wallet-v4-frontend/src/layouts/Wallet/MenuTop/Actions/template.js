import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { IconButton } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-top: 10px;
  width: auto;
`

const Actions = props => {
  const { handleSend, handleRequest } = props

  return (
    <Wrapper>
      <IconButton name='send' onClick={handleSend} min='100px'>
        <FormattedMessage id='layouts.wallet.menutop.send' defaultMessage='Send' />
      </IconButton>
      <IconButton style={spacing('ml-15')} name='request' onClick={handleRequest} min='100px'>
        <FormattedMessage id='layouts.wallet.menutop.request' defaultMessage='Request' />
      </IconButton>
    </Wrapper>
  )
}

Actions.propTypes = {
  handleSend: PropTypes.func.isRequired,
  handleRequest: PropTypes.func.isRequired
}

export default Actions
