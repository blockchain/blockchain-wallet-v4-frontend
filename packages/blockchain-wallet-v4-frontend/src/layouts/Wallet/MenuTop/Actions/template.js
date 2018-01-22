import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { ButtonGroup, IconButton } from 'blockchain-info-components'

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
      <IconButton name='send' onClick={handleSend}>
        <FormattedMessage id='layouts.wallet.menutop.send' defaultMessage='Send' />
      </IconButton>
      <ButtonGroup>
        <IconButton name='request' onClick={handleRequest}>
          <FormattedMessage id='layouts.wallet.menutop.request' defaultMessage='Request' />
        </IconButton>
        <IconButton name='clipboard' />
      </ButtonGroup>
    </Wrapper>
  )
}

export default Actions
