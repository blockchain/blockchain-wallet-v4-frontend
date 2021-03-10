import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { BlockchainLoader, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

const Wrapper = styled(FlyoutWrapper)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  text-align: center;
`

const Loading: React.FC<Props> = ({ order, polling }) => {
  return (
    <Wrapper>
      <BlockchainLoader width='80px' height='80px' />
      <Text
        weight={600}
        size='20px'
        color='grey800'
        style={{ marginTop: '24px' }}
      >
        {polling || order ? (
          <FormattedMessage
            id='modals.simplebuy.processing'
            defaultMessage='Processing…'
          />
        ) : (
          <FormattedMessage
            id='modals.simplebuy.linking_card'
            defaultMessage='Securely Linking Your Card'
          />
        )}
      </Text>
      <Text
        weight={600}
        size='14px'
        color='grey600'
        style={{ marginTop: '20px' }}
      >
        <FormattedMessage
          id='modals.simplebuy.linking_card.time'
          defaultMessage='This could take up to 1 minute. Please do not close this window.'
        />
      </Text>
    </Wrapper>
  )
}

type Props = { order?: boolean; polling?: boolean }

export default Loading
