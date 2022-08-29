import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { IconCart, PaletteColors } from '@blockchain-com/constellation'

import { Button, Image, Link, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const NftNoOwnedAssets: React.FC<Props> = () => {
  return (
    <Flex
      gap={8}
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      style={{
        height: '100%',
        margin: '0 auto',
        marginTop: '52px',
        maxWidth: '500px',
        textAlign: 'center',
        width: '100%'
      }}
    >
      <Image name='nft-nothing-here' />
      <Text style={{ marginTop: '20px' }} size='32px' weight={600} color='black'>
        <FormattedMessage id='copy.no_owned_nfts' defaultMessage="You Don't Have Any NFTs" />
      </Text>
      <Text size='16px' weight={500}>
        <FormattedMessage
          id='copy.lets_change_that_buy_nfts'
          defaultMessage="Let's change that. You can buy directly from the Blockchain Marketplace or transfer from an existing wallet right to your Blockchain wallet."
        />
      </Text>
      <LinkContainer to='/nfts/explore'>
        <Link>
          <Button data-e2e='shopNfts' nature='primary'>
            <Flex alignItems='center' gap={4}>
              <IconCart label='cart' color={PaletteColors['white-900']} />
              <FormattedMessage id='copy.shop_nfts' defaultMessage='Shop NFTs' />
            </Flex>
          </Button>
        </Link>
      </LinkContainer>
    </Flex>
  )
}

type Props = {}

export default NftNoOwnedAssets
