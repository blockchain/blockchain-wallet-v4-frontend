import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { FlatLoader, Text } from 'blockchain-info-components'

const LoaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 25px;
`

const Loading = props => {
  return (
    <React.Fragment>
      <Text size='16px' weight={300}>
        <FormattedMessage
          id='modals.lockboxsetup.connectstep.connectdevice'
          defaultMessage='Please unlock your device and open your bitcoin app to continue.'
        />
      </Text>
      <LoaderContainer>
        <FlatLoader width='150px' height='25px' />
      </LoaderContainer>
    </React.Fragment>
  )
}

export default Loading
