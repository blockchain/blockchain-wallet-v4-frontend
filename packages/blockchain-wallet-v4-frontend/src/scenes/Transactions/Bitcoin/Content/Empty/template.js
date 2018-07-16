import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Icon, IconButton, Separator, Text } from 'blockchain-info-components'
import BitcoinWelcome from './BitcoinWelcome'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const Transactions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items : center;
  margin-top: 50px;
`
const Bitcoin = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items : center;
  margin-top: 25px;
  & > :first-child { margin-right: 10px; }
`
const TransactionIcon = styled(Icon)`
justify-content: center;
`

const Empty = props => {
  const { handleSend, handleRequest } = props

  return (
    <Wrapper>
      <BitcoinWelcome />
      <Transactions>
        <Text size='20px' weight={300} capitalize>
          <TransactionIcon name='transactions' />
          <FormattedMessage id='scenes.transactions.bitcoin.content.empty.transactions' defaultMessage='Your transactions' />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage id='scenes.transactions.bitcoin.content.empty.explain' defaultMessage='Transactions occur when you receive and send bitcoin.' />
        </Text>
        <Separator />
      </Transactions>
      <Bitcoin>
        <IconButton name='send' nature='empty' uppercase onClick={handleSend}>
          <FormattedMessage id='scenes.transactions.bitcoin.content.empty.send' defaultMessage='Send' />
        </IconButton>
        <IconButton name='request' nature='empty' uppercase onClick={handleRequest}>
          <FormattedMessage id='scenes.transactions.bitcoin.content.empty.request' defaultMessage='Request' />
        </IconButton>
      </Bitcoin>
    </Wrapper>
  )
}

Empty.propTypes = {
  handleSend: PropTypes.func.isRequired,
  handleRequest: PropTypes.func.isRequired
}

export default Empty
