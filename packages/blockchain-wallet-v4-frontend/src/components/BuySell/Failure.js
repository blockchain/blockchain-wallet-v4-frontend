import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Text, Link, Button } from 'blockchain-info-components'
import { path } from 'ramda'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  div:last-of-type {
    margin-top: 10px;
  }
`
const RefreshContainer = styled(Container)`
  height: 100px;
`

const link = (
  <Link
    href='https://support.blockchain.com/hc/en-us/requests/new'
    target='_blank'
    size='16px'
    weight={300}
  >
    <FormattedMessage
      id='buysell.general.failure.here'
      defaultMessage='here.'
    />
  </Link>
)

const Failure = ({ message, refresh }) => (
  <Container>
    <Text weight={300} size='16px'>
      <FormattedMessage
        id='buysell.general.failure.message'
        defaultMessage='Sorry, an error has occurred while connecting to your exchange partner.'
      />
    </Text>
    <Text weight={300} size='16px'>
      <FormattedMessage
        id='buysell.general.failure.message2'
        defaultMessage='If the problem continues, please reach out to our support team {supportLink}'
        values={{ supportLink: link }}
      />
    </Text>
    <Text weight={300} size='14px'>
      <FormattedMessage
        id='buysell.general.failure.message3'
        defaultMessage='Error code: {err}'
        values={{ err: path(['error', 'message'], message) }}
      />
    </Text>
    {refresh && (
      <RefreshContainer>
        <Button nature='primary' onClick={refresh}>
          <FormattedMessage
            id='buysell.general.failure.refresh'
            defaultMessage='Refresh'
          />
        </Button>
      </RefreshContainer>
    )}
  </Container>
)

export default Failure
