import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { BlockchainLoader, Text } from 'blockchain-info-components'

const Title = styled.div`
  text-align: center;
  margin-bottom: 24px;
`
const Content = styled.div`
  text-align: center;
  max-width: 400px;
  margin: 10px auto;
`

const InstallFirmware = props => {
  // const { status } = props
  return (
    <React.Fragment>
      <Title>
        <Text size='22px' weight={400}>
          <FormattedMessage
            id='modals.lockboxfirmware.installstep.title'
            defaultMessage='Finalizing Install'
          />
        </Text>
        <Content>
          <Text size='13px' weight={300}>
            <FormattedMessage
              id='modals.lockboxfirmware.installstep.message'
              defaultMessage='Finalizing the update on your Lockbox. Please follow the instructions on your device to complete the install.'
            />
          </Text>
          <BlockchainLoader
            height='30px'
            width='30px'
            style={{ marginTop: '12px' }}
          />
        </Content>
      </Title>
    </React.Fragment>
  )
}

export default InstallFirmware
