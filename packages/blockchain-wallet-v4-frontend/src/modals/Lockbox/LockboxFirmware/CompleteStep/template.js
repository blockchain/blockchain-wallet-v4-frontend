import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'

const Title = styled.div`
  text-align: center;
  margin-bottom: 20px;
`
const Content = styled.div`
  text-align: center;
  margin-bottom: 20px;
`
const ButtonContainer = styled.div`
  margin-top: 30px;
`

const CompleteStep = (props) => {
  const { onInstallApps, status } = props

  return (
    <>
      {status === 'uptodate' && (
        <>
          <Title>
            <Text weight={500}>
              <FormattedMessage
                id='modals.lockboxfirmware.completestep.uptodate.title'
                defaultMessage='Device Up-to-date!'
              />
            </Text>
            <Content>
              <Text weight={400}>
                <FormattedMessage
                  id='modals.lockboxfirmware.completestep.uptodate.message'
                  defaultMessage='Your device is already up-to-date.'
                />
              </Text>
            </Content>
          </Title>
        </>
      )}
      {status === 'success' && (
        <>
          <Title>
            <Text>
              <FormattedMessage
                id='modals.lockboxfirmware.completestep.installsuccess.title'
                defaultMessage='Update Complete!'
              />
            </Text>
          </Title>
          <Content>
            <Text>
              <FormattedMessage
                id='modals.lockboxfirmware.completestep.installsuccess.message'
                defaultMessage='Your firmware was successfully updated. You will now need to reinstall the apps on your device.'
              />
            </Text>
          </Content>
          <Image
            width='100%'
            name='lockbox-success'
            srcset={{
              'lockbox-success2': '2x',
              'lockbox-success3': '3x'
            }}
          />
        </>
      )}
      {status === 'error' && (
        <>
          <Title>
            <Text>
              <FormattedMessage
                id='modals.lockboxfirmware.completestep.installerror.title'
                defaultMessage='Update Failed!'
              />
            </Text>
          </Title>
          <Content>
            <Text>
              <FormattedMessage
                id='modals.lockboxfirmware.completestep.installerror.message'
                defaultMessage='The firmware update failed to install. Please try again or reach out to support if the issue persists.'
              />
            </Text>
          </Content>
        </>
      )}
      <ButtonContainer>
        {status === 'success' && (
          <Button
            fullwidth
            nature='primary'
            onClick={onInstallApps}
            style={{ marginBottom: '10px' }}
          >
            <FormattedMessage
              id='modals.lockboxfirmware.completestep.installApps'
              defaultMessage='Install Apps'
            />
          </Button>
        )}
      </ButtonContainer>
    </>
  )
}

export default CompleteStep
