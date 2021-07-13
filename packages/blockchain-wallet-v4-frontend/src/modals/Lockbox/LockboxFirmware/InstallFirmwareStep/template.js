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

const InstallFirmware = props => {
  return (
    <React.Fragment>
      <Title>
        <Text size='22px' weight={500}>
          <FormattedMessage
            id='modals.lockboxfirmware.installstep.title'
            defaultMessage='Finalizing Install'
          />
        </Text>
        <Content>
          <Text weight={400}>
            <FormattedMessage
              id='modals.lockboxfirmware.installstep.message'
              defaultMessage='Finalizing the update on your Lockbox. Enter your device pin when prompted.'
            />
          </Text>
          <BlockchainLoader
            height='75px'
            width='75px'
            style={{ marginTop: '45px' }}
          />
        </Content>
      </Title>
    </React.Fragment>
  )
}

export default InstallFirmware
