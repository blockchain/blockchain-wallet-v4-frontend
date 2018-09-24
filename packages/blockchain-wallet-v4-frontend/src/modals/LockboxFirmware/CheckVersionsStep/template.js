import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { RotateSync } from 'components/RotateSync'
import { Button, Text } from 'blockchain-info-components'

const Title = styled.div`
  text-align: center;
  margin-bottom: 24px;
`
const Content = styled.div`
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
`
const ButtonContainer = styled.div`
  margin-top: 30px;
`
const RotateSyncContainer = styled(RotateSync)`
  margin-left: 15px;
`
const CheckVersionsStep = props => {
  return (
    <React.Fragment>
      <Title>
        <Text size='16px' weight={400}>
          <FormattedMessage
            id='modals.lockboxfirmware.checkversions.title'
            defaultMessage='Step 2. Check for updates'
          />
        </Text>
      </Title>
      <Content>
        <Text size='13px' weight={300}>
          <FormattedMessage
            id='modals.lockboxfirmware.checkversions.subtitle'
            defaultMessage='Please wait while we check for updates for your device.'
          />
        </Text>
      </Content>
      <ButtonContainer>
        <Button fullwidth disabled={true} nature='dark' onClick={() => {}}>
          <FormattedMessage
            id='modals.lockboxfirmware.checkversions.loading'
            defaultMessage='Checking Versions'
          />
          <RotateSyncContainer size='16px' color='white' />
        </Button>
      </ButtonContainer>
    </React.Fragment>
  )
}

export default CheckVersionsStep
