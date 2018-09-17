import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import { Modal, ModalBody, FlatLoader, Text } from 'blockchain-info-components'

const Wrapper = styled(ModalBody)`
  padding: 20px;
`
const Title = styled.div`
  text-align: center;
  margin-bottom: 40px;
`
const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 26px;
`

const LockboxAppInstall = props => (
  <Modal size='large' position={props.position} total={props.total}>
    <Wrapper>
      <Title>
        <Text>
          <FormattedMessage
            id='modals.lockboxappinstall.title'
            defaultMessage='Install Lockbox Applications'
          />
        </Text>
      </Title>
      <Content>
        <FlatLoader
          width='175px'
          height='25px'
          style={{ marginBottom: '20px' }}
        />
        <Text size='14px' weight={300}>
          <FormattedHTMLMessage
            id='modals.lockboxappinstall.subtitle'
            defaultMessage='Allow device manager on the device when prompted'
          />
        </Text>
      </Content>
    </Wrapper>
  </Modal>
)

export default LockboxAppInstall
