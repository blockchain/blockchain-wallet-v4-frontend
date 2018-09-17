import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import {
  Button,
  Icon,
  Modal,
  ModalBody,
  FlatLoader,
  Text
} from 'blockchain-info-components'

const Wrapper = styled.div`
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
const SuccessMessage = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-content: center;
`
const SuccessIcon = styled(Icon)`
  margin-right: 14px;
`
const ButtonContainer = styled.div`
  margin-top: 35px;
`

const LockboxAppInstall = props => (
  <Modal size='large' position={props.position} total={props.total}>
    <ModalBody>
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
    </ModalBody>
  </Modal>
)

export default LockboxAppInstall
