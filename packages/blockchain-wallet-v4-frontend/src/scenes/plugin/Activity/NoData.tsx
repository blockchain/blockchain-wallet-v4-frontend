import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const Wrapper = styled(Flex)`
  height: 100%;
`

const NoTransactionText = styled(Text)`
  text-align: center;
`

const NoData = () => (
  <Wrapper justifyContent='space-between' flexDirection='column'>
    <Text lineHeight='150%' size='14' weight={500}>
      <FormattedMessage
        id='plugin.activity.noData.message'
        defaultMessage='Here you can view the history of all your transactions'
      />
    </Text>

    <NoTransactionText color='white' lineHeight='150%' size='14' weight={500}>
      <FormattedMessage
        id='plugin.activity.noData.noTransactions'
        defaultMessage='No transactions to show'
      />
    </NoTransactionText>

    <Button height='48px' data-e2e='add-crypto-button'>
      <FormattedMessage id='plugin.activity.button.addCrypto' defaultMessage='Add crypto' />
    </Button>
  </Wrapper>
)

export default NoData
