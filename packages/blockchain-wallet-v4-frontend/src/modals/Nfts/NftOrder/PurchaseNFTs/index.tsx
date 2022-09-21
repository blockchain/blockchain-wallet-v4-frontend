import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Padding, PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Image, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import FlyoutHeader from 'components/Flyout/Header'
import { media } from 'services/styles'

import { Props as OwnProps } from '..'

const PurchaseNFTs: React.FC<Props> = (props) => {
  const { close } = props

  const CustomText = styled(Text)`
    text-align: center;
    width: 418px;
    ${media.tablet`
  width: 100%;
  `}
  `

  const NumberCircle = styled.div`
    border-radius: 50%;
    width: 18px;
    height: 18px;
    padding: 4px;
    background: ${PaletteColors['grey-000']};
    text-align: center;
  `

  return (
    <>
      <Flex flexDirection='column' gap={16} alignItems='center'>
        <FlyoutHeader sticky data-e2e='howDoesThisWork' mode='back' onClick={() => close()}>
          <FormattedMessage id='copy.how-does-this-work' defaultMessage='How Does This Work' />
        </FlyoutHeader>
        <Flex flexDirection='column' gap={16} alignItems='center'>
          <Image width='200px' name='nft-purchase' />
          <Text color='grey900' size='20px' weight={600}>
            Purchase NFTs
          </Text>
          <CustomText color='grey700' size='16px' weight={500}>
            Buy an NFT using your Blockchain.com app and Walletconnect on Opensea or Rarible.
          </CustomText>
          <Flex flexDirection='column' alignItems='flex-start' style={{ padding: '1em' }}>
            <Text color='grey900' size='16px' weight={600}>
              Instructions
            </Text>
            <Padding top={16}>
              <Flex alignItems='center' gap={8}>
                <NumberCircle>
                  <Text color='grey600' weight={600}>
                    1
                  </Text>
                </NumberCircle>
                <div>
                  <Text color='grey900' weight={600} size='16px'>
                    Go To One Of The Marketplace’s Above
                  </Text>
                </div>
              </Flex>
            </Padding>
            <Padding top={16}>
              <Flex alignItems='center' gap={8}>
                <NumberCircle>
                  <Text color='grey600' weight={600}>
                    2
                  </Text>
                </NumberCircle>
                <div>
                  <Text color='grey900' weight={600} size='16px'>
                    Open Your Blockchain.com App
                  </Text>
                </div>
              </Flex>
            </Padding>
            <Padding top={16}>
              <Flex alignItems='center' gap={8}>
                <NumberCircle>
                  <Text color='grey600' weight={600}>
                    3
                  </Text>
                </NumberCircle>
                <div>
                  <Text color='grey900' weight={600} size='16px'>
                    Open WalletConnect
                  </Text>
                  <Text weight={500} size='12px'>
                    Square icon in the upper right corner of the app.
                  </Text>
                </div>
              </Flex>
            </Padding>
            <Padding top={16}>
              <Flex alignItems='center' gap={8}>
                <NumberCircle>
                  <Text color='grey600' weight={600}>
                    4
                  </Text>
                </NumberCircle>
                <div>
                  <Text color='grey900' weight={600} size='16px'>
                    Login to the marketplace with WalletConnect
                  </Text>
                  <Text weight={500} size='12px'>
                    This will be an option after selecting Login
                  </Text>
                </div>
              </Flex>
            </Padding>
            <Padding top={16}>
              <Flex alignItems='center' gap={8}>
                <NumberCircle>
                  <Text color='grey600' weight={600}>
                    5
                  </Text>
                </NumberCircle>
                <div>
                  <Text color='grey900' weight={600} size='16px'>
                    Once Purchased, NFTs will show up here
                  </Text>
                  <Text weight={500} size='12px'>
                    Access your NFTs from your Blockchain Wallet
                  </Text>
                </div>
              </Flex>
            </Padding>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

type Props = OwnProps

export default PurchaseNFTs
