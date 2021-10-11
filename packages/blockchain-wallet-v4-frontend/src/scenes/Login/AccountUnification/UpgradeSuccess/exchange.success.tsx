import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Image, Link, Text } from 'blockchain-info-components'

import { Props } from '../../index'
import { CenteredColumn } from '../../model'

const ExchangeSuccess = (props: Props) => {
  return (
    <>
      <CenteredColumn style={{ textAlign: 'center' }}>
        <Image name='exchange-logo' style={{ marginBottom: '20px' }} />
        <Text size='20px' weight={500} color='grey600' lineHeight='1.5'>
          <FormattedMessage
            id='scenes.login.upgrade_success.exchange'
            defaultMessage='Upgrade successful, taking you to the Blockchain.com Exchange...'
          />
        </Text>
        <Button nature='green' data-e2e='test'>
          <Link
            href={`https://local.staging.blockchain.info:8888/auth?jwt=${props.jwtToken}`}
            rel='noopener noreferrer'
            target='_blank'
            color='white'
          >
            Continue To Exchange
          </Link>
        </Button>
      </CenteredColumn>
    </>
  )
}

export default ExchangeSuccess
