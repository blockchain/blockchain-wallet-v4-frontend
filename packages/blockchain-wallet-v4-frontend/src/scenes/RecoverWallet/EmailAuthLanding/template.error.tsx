import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Flex, IconCloseCircle, SemanticColors } from '@blockchain-com/constellation'

import { Link, Text } from 'blockchain-info-components'

const Error = ({ error }: Props) => {
  return (
    <Flex alignItems='center' flexDirection='column'>
      <IconCloseCircle color={SemanticColors.error} name='close-circle' size='large' />

      <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }}>
        <FormattedMessage
          id='scenes.verifyemailtoken.error'
          defaultMessage='Something went wrong.'
        />
      </Text>
      <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
        {error}
      </Text>
      <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
        <FormattedMessage
          id='scenes.verifyaccountrecovery.error.tryagain'
          defaultMessage='Try again or contact support.'
        />
      </Text>

      <Link target='_blank' href='https://support.blockchain.com/'>
        <Button
          variant='primary'
          width='full'
          style={{ marginTop: '16px' }}
          data-e2e='support'
          text={<FormattedMessage id='buttons.contact_support' defaultMessage='Contact Support' />}
        />
      </Link>
    </Flex>
  )
}

type Props = { error?: string }

export default Error
