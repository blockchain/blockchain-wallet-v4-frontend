import React from 'react'
import { FormattedMessage } from 'react-intl'
import { prop } from 'ramda'
import styled from 'styled-components'

import { Button, Link, Text, TextGroup } from 'blockchain-info-components'
import { FETCH_FEES_FAILURE } from 'blockchain-wallet-v4/src/redux/payment/model'
import { checkForVulnerableAddressError } from 'services/misc'

import {
  BROKERAGE_INELIGIBLE,
  IneligibleErrorMessage
} from '../../modals/Brokerage/components'

const MessageText = styled(Text)`
  width: 80%;
  margin-bottom: 20px;
`

const ErrorHandler = props => {
  const { message, onClick } = props
  const e2e = props['data-e2e']
  const errorMessage = prop('message', message) || prop('description', message)
  const vulnerableAddress = checkForVulnerableAddressError(message)

  if (vulnerableAddress) {
    return (
      <React.Fragment>
        <MessageText size='18px' weight={400}>
          {message}
        </MessageText>
        <Button nature='primary' onClick={() => onClick(vulnerableAddress)}>
          <Text size='18px' weight={400} color='white'>
            <FormattedMessage
              id='components.dataerror.archiveaddress'
              defaultMessage='Archive Address'
            />
          </Text>
        </Button>
      </React.Fragment>
    )
  } else if (errorMessage === BROKERAGE_INELIGIBLE) {
    return <IneligibleErrorMessage />
  } else if (errorMessage === FETCH_FEES_FAILURE) {
    return (
      <Text size='16px' weight={400}>
        <FormattedMessage
          id='components.dataerror.feesfetchfailure'
          defaultMessage='There was a problem fetching fees. Please try again later.'
        />
      </Text>
    )
  } else if (typeof errorMessage === 'string') {
    return (
      <Text size='16px' color='error' weight={500}>
        {errorMessage}
      </Text>
    )
  } else {
    return (
      <TextGroup inline>
        <Text size='18px' weight={400}>
          <FormattedMessage
            id='components.dataerror.body'
            defaultMessage='Please '
          />
        </Text>
        <Link size='18px' data-e2e={e2e ? `${e2e}Link` : ''} onClick={onClick}>
          <FormattedMessage
            id='components.dataerror.click'
            defaultMessage='click here'
          />
        </Link>
        <Text size='18px' weight={400}>
          <FormattedMessage
            id='components.dataerror.refresh'
            defaultMessage=' to refresh.'
          />
        </Text>
      </TextGroup>
    )
  }
}

export default ErrorHandler
