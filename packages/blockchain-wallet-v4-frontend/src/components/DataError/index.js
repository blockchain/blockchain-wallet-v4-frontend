import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import {
  Image,
  Link,
  Text,
  TextGroup,
  Button
} from 'blockchain-info-components'
import { checkForVulnerableAddressError } from 'services/ErrorCheckService'

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
  align-items: center;
  margin-top: 20px;
`
const Header = styled(Text)`
  margin-top: 30px;
  margin-bottom: 20px;
`
const MessageText = styled(Text)`
  width: 80%;
  margin-bottom: 20px;
`

const DataErrorContainer = props => {
  const { message, onClick, onArchive } = props
  const e2e = props['data-e2e']
  const renderErrorHandling = msg => {
    const vulnerableAddress = checkForVulnerableAddressError(msg)
    if (vulnerableAddress) {
      return (
        <React.Fragment>
          <MessageText size='18px' weight={300}>
            {msg}
          </MessageText>
          <Button nature='primary' onClick={() => onArchive(vulnerableAddress)}>
            <Text size='18px' weight={300} color='white'>
              <FormattedMessage
                id='components.dataerror.archiveaddress'
                defaultMessage='Archive Address'
              />
            </Text>
          </Button>
        </React.Fragment>
      )
    } else {
      return (
        <TextGroup inline>
          <Text size='18px' weight={300}>
            <FormattedMessage
              id='components.dataerror.body'
              defaultMessage='Please '
            />
          </Text>
          <Link
            size='18px'
            data-e2e={e2e ? `${e2e}Link` : ''}
            onClick={onClick}
          >
            <FormattedMessage
              id='components.dataerror.click'
              defaultMessage='click here'
            />
          </Link>
          <Text size='18px' weight={300}>
            <FormattedMessage
              id='components.dataerror.refresh'
              defaultMessage=' to refresh.'
            />
          </Text>
        </TextGroup>
      )
    }
  }

  return (
    <Wrapper>
      <Empty>
        <Image name='empty-search' width='260px' />
        <Header size='18px' weight={500}>
          <FormattedMessage
            id='components.dataerror.header'
            defaultMessage='Oops, something went wrong here!'
          />
        </Header>
        {renderErrorHandling(message)}
      </Empty>
    </Wrapper>
  )
}

DataErrorContainer.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default DataErrorContainer
