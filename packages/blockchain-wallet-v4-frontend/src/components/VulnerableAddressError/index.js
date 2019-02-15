import React from 'react'
import styled from 'styled-components'
import { Button, Text, Image } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { checkForVulnerableAddressError } from 'services/ErrorCheckService'

const ErrorContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const MessageText = styled(Text)`
  width: 80%;
  margin: 20px 0px;
`
const Error = ({ message, onArchive }) => {
  const vulnerableAddress = checkForVulnerableAddressError(message)
  if (!vulnerableAddress) return null
  return (
    <ErrorContainer>
      <Image name='empty-search' width='260px' />
      <MessageText size='18px' weight={300}>
        {message}
      </MessageText>
      <Button nature='primary' onClick={() => onArchive(vulnerableAddress)}>
        <Text size='16px' weight={300} color='white'>
          <FormattedMessage
            id='scenes.settings.addresses.btc.wallets.addresserror'
            defaultMessage='Archive Address'
          />
        </Text>
      </Button>
    </ErrorContainer>
  )
}
export default Error
