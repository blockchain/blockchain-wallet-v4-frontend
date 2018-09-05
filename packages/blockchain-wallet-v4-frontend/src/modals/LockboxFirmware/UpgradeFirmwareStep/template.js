import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text, ModalBody } from 'blockchain-info-components'

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4px 0 10px;
  & > :last-child {
    margin-top: 6px;
  }
`
const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const UpgradeFirmwareStep = props => {
  return (
    <React.Fragment>
      <ModalBody>
        <Header>
          <Text size='24px' weight={400}>
            <FormattedMessage
              id='modals.lockboxfirmware.upgradefirmwarestep.title'
              defaultMessage='Install Latest Firmware'
            />
          </Text>
        </Header>
        <Content>
          <Text size='24px' weight={400}>
            <FormattedMessage
              id='modals.lockboxfirmware.upgradefirmwarestep.subtitle'
              defaultMessage='Implement this...'
            />
          </Text>
        </Content>
      </ModalBody>
    </React.Fragment>
  )
}

export default UpgradeFirmwareStep
