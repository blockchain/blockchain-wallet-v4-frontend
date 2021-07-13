import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'

const ContentWrapper = styled.div`
  height: 19.5rem;
  width: 19.5rem;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  box-sizing: border-box;
`

const Header = styled(Text)`
  margin-bottom: 1.5rem;
`

const Warning = styled(Text)`
  margin-bottom: 0.25rem;
`

const Body = styled(Text)`
  margin-bottom: 2rem;
`

const KeyIcon = styled(Icon)`
  margin-bottom: 20px;
`
const ViewKeys = ({
  showQrCode,
  toggleQrCode
}: {
  showQrCode: boolean
  toggleQrCode: () => void
}) => (
  <ContentWrapper>
    <KeyIcon name='key' color='blue600' size='16px' />
    <Header color='grey800' size='20px' weight={600}>
      <FormattedMessage
        id='scenes.settings.addresses.viewkeys.header'
        defaultMessage='View Your Private Keys.'
      />
    </Header>

    <Warning color='error' size='14px' weight={600}>
      <FormattedMessage
        id='scenes.settings.addresses.viewkeys.warning'
        defaultMessage='Warning'
      />
    </Warning>

    <Body color='grey600' size='14px' weight={500}>
      <FormattedMessage
        id='scenes.settings.addresses.viewkeys.warning-body'
        defaultMessage='Do not share your private keys with anyone. We will never ask for them. Sharing your keys may result in a loss of funds.'
      />
    </Body>

    <Button
      data-e2e='show_private_key_button'
      width='262px'
      nature='empty-blue'
      onClick={toggleQrCode}
    >
      {showQrCode ? (
        <FormattedMessage id='buttons.hide' defaultMessage='Hide' />
      ) : (
        <FormattedMessage id='buttons.show' defaultMessage='Show' />
      )}
    </Button>
  </ContentWrapper>
)

export default ViewKeys
