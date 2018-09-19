import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Image, Link, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 50px 0;
`
const Header = styled(Text)`
  margin-top: 30px;
  margin-bottom: 20px;
`

class EmptyTxContainer extends React.PureComponent {
  render () {
    return (
      <Wrapper>
        <Image name='empty-tx' width='300px' />
        <Header size='18px' weight={500}>
          <FormattedMessage
            id='components.emptytx.header'
            defaultMessage="Oops, we couldn't find any transactions!"
          />
        </Header>
        <TextGroup inline>
          <Text size='18px' weight={300}>
            <FormattedMessage
              id='components.emptytx.body'
              defaultMessage='Please try filtering by a different criteria or'
            />
          </Text>
          <Text size='18px' weight={300}>
            <Link
              size='18px'
              href='https://support.blockchain.com/'
              target='_blank'
              referrer='noreferrer'
            >
              <FormattedMessage
                id='components.emptytx.body2'
                defaultMessage='reach out to us'
              />
            </Link>
          </Text>
          <Text size='18px' weight={300}>
            <FormattedMessage
              id='components.emptytx.body3'
              defaultMessage='if you need help.'
            />
          </Text>
        </TextGroup>
      </Wrapper>
    )
  }
}

export default EmptyTxContainer
