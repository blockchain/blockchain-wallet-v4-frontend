import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Icon, IconButton, Separator, Text } from 'blockchain-info-components'
import EtherWelcome from './EtherWelcome'

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
  margin-top: 100px;
`
const Ether = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items : center;
  margin-top: 25px;
`

const Empty = props => {
  return (
    <Wrapper>
      <EtherWelcome />
      <Transactions>
        <Text size='20px' weight={300} capitalize>
          <Icon name='transactions' />
          <FormattedMessage id='scenes.transactions.ether.content.empty.transactions' defaultMessage='Your transactions' />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage id='scenes.transactions.ether.content.empty.explain' defaultMessage='Transactions occur when you receive and send ether.' />
        </Text>
        <Separator />
      </Transactions>
      <Ether>
        <LinkContainer to='/exchange'>
          <IconButton name='exchange' nature='empty' uppercase>
            <FormattedMessage id='scenes.transactions.ether.content.empty.getether' defaultMessage='Get ether' />
          </IconButton>
        </LinkContainer>
      </Ether>
    </Wrapper>
  )
}

export default Empty
