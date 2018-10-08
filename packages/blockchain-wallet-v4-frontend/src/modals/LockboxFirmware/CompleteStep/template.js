import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'

const Title = styled.div`
  text-align: center;
  margin-bottom: 24px;
`
const Content = styled.div`
  text-align: center;
  max-width: 400px;
  margin: 10px auto;
`
const ButtonContainer = styled.div`
  margin-top: 30px;
`

const CompleteStep = props => {
  const { closeAll, status } = props

  return (
    <React.Fragment>
      {status === 'uptodate' && (
        <React.Fragment>
          <Title>
            <Text size='22px' weight={400}>
              <FormattedMessage
                id='modals.lockboxfirmware.completestep.uptodate.title'
                defaultMessage='Device Up-to-date!'
              />
            </Text>
            <Content>
              <Text size='15px' weight={300}>
                <FormattedMessage
                  id='modals.lockboxfirmware.completestep.uptodate.message'
                  defaultMessage='Your device is already up-to-date.'
                />
              </Text>
            </Content>
          </Title>
        </React.Fragment>
      )}
      {status === 'success' && (
        <React.Fragment>
          <Title>
            <Text size='22px' weight={400}>
              <FormattedMessage
                id='modals.lockboxfirmware.completestep.installsuccess.title'
                defaultMessage='Update Complete!'
              />
            </Text>
          </Title>
          <Content>
            <Text size='15px' weight={300}>
              <FormattedMessage
                id='modals.lockboxfirmware.completestep.installsuccess.message'
                defaultMessage='Your firmware was successfully updated. You may now reinstall apps on your device from the settings page.'
              />
            </Text>
          </Content>
        </React.Fragment>
      )}
      {status === 'error' && (
        <React.Fragment>
          <Title>
            <Text size='22px' weight={400}>
              <FormattedMessage
                id='modals.lockboxfirmware.completestep.installerror.title'
                defaultMessage='Update Failed!'
              />
            </Text>
          </Title>
          <Content>
            <Text size='15px' weight={300}>
              <FormattedMessage
                id='modals.lockboxfirmware.completestep.installerror.message'
                defaultMessage='The firmware update failed to install. Please try again or reach out to support if the issue persists.'
              />
            </Text>
          </Content>
        </React.Fragment>
      )}
      <ButtonContainer>
        <Button fullwidth nature='success' onClick={closeAll}>
          <FormattedMessage
            id='modals.lockboxfirmware.completestep.close'
            defaultMessage='Close'
          />
        </Button>
      </ButtonContainer>
    </React.Fragment>
  )
}

export default CompleteStep
