import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { BlockchainLoader, Text } from 'blockchain-info-components'

const Title = styled.div`
  text-align: center;
  margin-bottom: 24px;
`
const Content = styled.div`
  text-align: center;
  max-width: 400px;
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const UninstallApps = props => {
  const { status } = props
  return (
    <React.Fragment>
      <Title>
        <Text size='22px' weight={500}>
          <FormattedMessage
            id='modals.lockboxfirmware.uninstallapps.title'
            defaultMessage='Verify Your Device'
          />
        </Text>
        <Content>
          <Text weight={400}>
            <FormattedMessage
              id='modals.lockboxfirmware.uninstallapps.message1'
              defaultMessage="Update in progress. Please keep your browser opened, your device opened, and wait while your device's applications are uninstalled for the time being."
            />
          </Text>
          <br />
          <Text>
            <FormattedMessage
              id='modals.lockboxfirmware.uninstallapps.message2'
              defaultMessage='Also, please verify the below on your device before continuing.'
            />
          </Text>
          <Text size='14px' weight={400} style={{ marginTop: '16px' }}>
            <b>{status}</b>
          </Text>
          <BlockchainLoader
            height='100px'
            width='100px'
            style={{ marginTop: '45px' }}
          />
        </Content>
      </Title>
    </React.Fragment>
  )
}

export default UninstallApps
