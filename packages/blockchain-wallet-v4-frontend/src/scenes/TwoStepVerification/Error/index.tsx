import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, IconCloseCircle, PaletteColors } from '@blockchain-com/constellation'

import { Button, Link, Text } from 'blockchain-info-components'

const Error = () => {
  return (
    <Flex alignItems='center' flexDirection='column'>
      <>
        <IconCloseCircle color={PaletteColors['red-600']} label='error' size='large' />
        <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }}>
          <FormattedMessage
            id='scenes.verifyemailtoken.error'
            defaultMessage='Something went wrong.'
          />
        </Text>
        <Text color='grey900' style={{ marginTop: '8px' }} size='16px' weight={500}>
          <FormattedMessage
            id='scenes.recover.error.tryagain'
            defaultMessage='Try recovering again or contact support.'
          />
        </Text>
      </>
      <Link target='_blank' href='https://support.blockchain.com/'>
        <Button nature='primary' fullwidth style={{ marginTop: '16px' }} height='50px' data-e2e=''>
          <FormattedMessage id='buttons.contact_support' defaultMessage='Contact Support' />
        </Button>
      </Link>
    </Flex>
  )
}

export default Error
