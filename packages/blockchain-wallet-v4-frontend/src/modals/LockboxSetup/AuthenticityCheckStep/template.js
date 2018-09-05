import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { has } from 'ramda'

import { Button, FlatLoader, Text } from 'blockchain-info-components'

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2px 0 14px;
  & > :last-child {
    margin-top: 6px;
  }
`
const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
`
const LoaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 25px;
`

const AuthenticityCheckStep = props => {
  const { newDeviceInfo, onNextStep } = props

  return (
    <Content>
      <Header>
        <Text size='15px' weight={400}>
          <FormattedMessage
            id='modals.lockboxsetup.authenticitycheck.title'
            defaultMessage='Please wait while we check the authenticity of your new device.'
          />
        </Text>
      </Header>
      {has('isAuthentic', newDeviceInfo) ? (
        <div>
          <Row>Is device authentic:: {newDeviceInfo.isAuthentic}</Row>
          <Row>
            <Button nature='primary' fullwidth onClick={onNextStep}>
              <FormattedMessage
                id='modals.lockboxsetup.authenticitycheck.continue'
                defaultMessage='Continue'
              />
            </Button>
          </Row>
        </div>
      ) : (
        <LoaderContainer>
          <FlatLoader width='150px' height='25px' />
        </LoaderContainer>
      )}
    </Content>
  )
}

export default AuthenticityCheckStep
