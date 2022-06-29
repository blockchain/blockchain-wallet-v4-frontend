import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Image, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const NftNoAssets: React.FC<Props> = () => {
  return (
    <Flex
      gap={8}
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      style={{ height: '100%', marginTop: '52px', width: '100%' }}
    >
      <Image name='nft-nothing-here' />
      <Text style={{ marginTop: '20px' }} size='32px' weight={600} color='black'>
        <FormattedMessage id='copy.not_much_here' defaultMessage='Not Much Here' />
      </Text>
      <Text size='16px' weight={500}>
        <FormattedMessage
          id='copy.change_query'
          defaultMessage='Looks like there are no assets for this collection or filter.'
        />
      </Text>
    </Flex>
  )
}

type Props = {}

export default NftNoAssets
