import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Image, Link, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const Empty = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items : center;
  margin-top: 50px;
`
const Header = styled(Text)`
  margin-top: 30px; 
  margin-bottom: 20px;
`

class EmptyTxContainer extends React.PureComponent {
  render () {
    return (
      <Wrapper>
        <Empty>
          <Image name='empty-tx' width='300px' />
          <Header size='18px' weight={500}>
            <FormattedMessage id='scenes.transactions.empty.content.header' defaultMessage="Oops, we couldn't find any transactions!" />
          </Header>
          <TextGroup inline>
            <Text size='18px' weight={300}>
              <FormattedHTMLMessage id='scenes.transactions.empty.content.body' defaultMessage='Please try filtering by a different criteria or ' />
            </Text>
            <Link size='18px' href='https://support.blockchain.com/' target='_blank' referrer='noreferrer'>
              <FormattedMessage id='scenes.transactions.empty.content.body2' defaultMessage='reach out to us ' />
            </Link>
            <Text size='18px' weight={300}>
              <FormattedMessage id='scenes.transactions.empty.content.body3' defaultMessage='if you need help.' />
            </Text>
          </TextGroup>
        </Empty>
      </Wrapper>
    )
  }
}

export default EmptyTxContainer
