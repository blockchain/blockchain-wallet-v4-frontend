import React from 'react'
import { FormattedMessage } from 'react-intl'
import { CombinedError } from 'urql'

import { Image, Link, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import { NftPageV2 } from '.'

const NftError: React.FC<Props> = ({ error }) => {
  return (
    <NftPageV2>
      <Flex flexDirection='column' alignItems='center' justifyContent='center'>
        <Image name='empty-search' />
        <Text size='24px' style={{ marginTop: '4px' }} weight={600}>
          <FormattedMessage id='copy.oops' defaultMessage='Oops. Something went wrong.' />
        </Text>
        <div style={{ marginTop: '12px' }}>
          <Flex flexDirection='column' alignItems='center'>
            <Text size='14px' weight={600}>
              <FormattedMessage
                id='copy.a_clue_below'
                defaultMessage='A clue for our support staff is below:'
              />
            </Text>
            <div style={{ marginTop: '20px' }} />
            <Text size='12px' weight={600} color='red500'>
              Request: {error.response?.url}
            </Text>
            <Text size='12px' weight={600} color='red500'>
              Response Status: {error.response?.status}
            </Text>
            <Text size='12px' weight={600} color='red500'>
              Message: {error.message}
            </Text>
            <Link href='https://support.blockchain.com' target='_blank' rel='noopener noreferrer'>
              <Text size='12px' color='blue600' style={{ marginTop: '8px', textAlign: 'center' }}>
                <FormattedMessage id='buttons.contact_support' defaultMessage='Contact Support' />
              </Text>
            </Link>
          </Flex>
        </div>
      </Flex>
    </NftPageV2>
  )
}

type Props = {
  error: CombinedError
}

export default NftError
