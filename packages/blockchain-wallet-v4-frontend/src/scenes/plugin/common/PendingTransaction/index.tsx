import React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconArrowLeft } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const Wrapper = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const InfoWrapper = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  height: 130px;
`

const IconWrapper = styled(Flex)`
  color: ${(props) => props.theme.grey400};
`

type PendingTransactionProps = {
  history: {
    goBack: (value: number) => void
  }
}
const PendingTransaction: React.FC<PendingTransactionProps> = (props) => {
  const { history } = props

  // Returs to previous page
  const goBack = () => {
    history.goBack(-1)
  }

  return (
    <Wrapper>
      <InfoWrapper>
        <IconWrapper>
          <IconArrowLeft height='24px' width='24px' cursor='pointer' onClick={goBack} />
        </IconWrapper>
        <Text color='white' size='20px' lineHeight='30px' weight={700}>
          <FormattedMessage
            id='scenes.plugin.common.pending-transaction.title'
            defaultMessage='You have a pending transaction'
          />
        </Text>
        <Text size='12px' lineHeight='18px' color='grey400'>
          <FormattedMessage
            id='scenes.plugin.common.pending-transaction.label'
            defaultMessage='Previous transactions must be completed before you can start a new one'
          />
        </Text>
      </InfoWrapper>
      <Flex justifyContent='space-between'>
        <Button
          onClick={goBack}
          nature='white-transparent'
          data-e2e='pluginPendingTransactionCancel'
          height='48px'
        >
          <FormattedMessage
            id='scenes.plugin.pending-transaction.cancel_button'
            defaultMessage='Cancel'
          />
        </Button>
        <Button height='48px' data-e2e='pluginPendingTransactionSpeedUp'>
          <FormattedMessage
            id='scenes.plugin.common.pending-transaction.speed-up_label'
            defaultMessage='Speed up'
          />
        </Button>
      </Flex>
    </Wrapper>
  )
}

export default PendingTransaction
