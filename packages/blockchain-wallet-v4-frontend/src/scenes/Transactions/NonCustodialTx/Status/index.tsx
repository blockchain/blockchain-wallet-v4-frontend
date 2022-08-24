import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconAlert } from '@blockchain-com/icons'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const Status = (props: Props) => (
  <Text size='16px' color='grey800' weight={600} data-e2e='txTypeText'>
    {props.type === 'sent' && (
      <FormattedMessage
        id='scenes.transactions.bitcoin.content.list.listitem.status.sent'
        defaultMessage='Sent {coin}'
        values={{ coin: props.coinTicker }}
      />
    )}
    {props.type === 'received' ? (
      props.isRBF ? (
        <Flex alignItems='center' gap={2}>
          <Icon label='alert' size='sm' color='red600'>
            <IconAlert />
          </Icon>
          <i>
            <FormattedMessage
              id='scenes.transactions.bitcoin.content.list.listitem.status.receiving'
              defaultMessage='Receiving {coin}'
              values={{ coin: props.coinTicker }}
            />
          </i>
        </Flex>
      ) : (
        <FormattedMessage
          id='scenes.transactions.bitcoin.content.list.listitem.status.received'
          defaultMessage='Received {coin}'
          values={{ coin: props.coinTicker }}
        />
      )
    ) : null}
    {props.type === 'transferred' && (
      <FormattedMessage
        id='scenes.transactions.bitcoin.content.list.listitem.status.transferred'
        defaultMessage='Transferred {coin}'
        values={{ coin: props.coinTicker }}
      />
    )}
  </Text>
)

type Props = {
  coinTicker: string
  isRBF?: boolean
  type: 'sent' | 'received' | 'transferred'
}

export default Status
