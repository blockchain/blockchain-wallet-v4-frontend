import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Image, Link, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const Header = styled(Text)`
  margin: 15px 0 5px;
`

class EmptyResultsContainer extends React.PureComponent {
  render() {
    return (
      <Wrapper data-e2e='noTransactionsFound'>
        <Image name='empty-tx' width='250px' />
        <Header size='16px' weight={500}>
          <FormattedMessage
            id='components.emptytx.header'
            defaultMessage="Oops, we couldn't find any transactions!"
          />
        </Header>
        <TextGroup inline>
          <Text size='12px' weight={400}>
            <FormattedMessage
              id='components.emptytx.body'
              defaultMessage='Please try filtering by a different criteria or'
            />
          </Text>
          <Text size='12px' weight={400}>
            <Link
              size='12px'
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
          <Text size='12px' weight={400}>
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

export default EmptyResultsContainer
