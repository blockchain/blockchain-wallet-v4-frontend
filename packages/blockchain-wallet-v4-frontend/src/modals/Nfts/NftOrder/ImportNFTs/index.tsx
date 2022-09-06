import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Padding, PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import { Flex } from 'components/Flex'
import FlyoutHeader from 'components/Flyout/Header'
import QRCodeWrapper from 'components/QRCode/Wrapper'
import { actions } from 'data'
import { media } from 'services/styles'

import { Props as OwnProps } from '..'

const ImportNFTs: React.FC<Props> = (props) => {
  const { close, defaultEthAddr } = props
  const dispatch = useDispatch()

  const CustomText = styled(Text)`
    text-align: center;
    width: 418px;
    ${media.tablet`
  width: 100%;
  `}
  `
  const QRCodeContainer = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    width: 100%;
    padding: 30px 0 0;
  `
  const NumberCircle = styled.div`
    border-radius: 50%;
    width: 18px;
    height: 18px;
    padding: 4px;
    background: ${PaletteColors['grey-000']};
    text-align: center;
  `

  const Address = styled(Flex)`
    width: fit-content;
  `

  const copyToClipboard = () => {
    navigator.clipboard.writeText(defaultEthAddr)
    dispatch(actions.alerts.displaySuccess('Copied to clipboard!'))
  }

  return (
    <Flex flexDirection='column' gap={16} alignItems='center'>
      <FlyoutHeader sticky data-e2e='getStarted' mode='back' onClick={close}>
        <FormattedMessage id='copy.get-started' defaultMessage='Get Started' />
      </FlyoutHeader>
      <Flex flexDirection='column' gap={16} alignItems='center'>
        <Image width='200px' name='nft-import' />
        <Text color='grey900' size='20px' weight={600}>
          Import your NFTs
        </Text>
        <CustomText color='grey700' size='16px' weight={500}>
          <FormattedMessage
            id='scenes.nfts.view.already_have_nfts_from_somewhere'
            defaultMessage='Already have NFTs somewhere else? Import them by sending from external
                        wallet to the address below.'
          />
        </CustomText>
        <QRCodeContainer>
          <QRCodeWrapper value={defaultEthAddr} size={256} />
        </QRCodeContainer>
        <Address justifyContent='space-between' alignItems='center'>
          <Text color='grey700' size='14px' weight={600}>
            <CryptoAddress canCopy>{defaultEthAddr}</CryptoAddress>
          </Text>
        </Address>{' '}
        <Button onClick={copyToClipboard} width='182px' nature='primary' data-e2e='get-started'>
          Copy Address
        </Button>
        <Flex flexDirection='column' alignItems='flex-start' style={{ padding: '1em 1em 2em' }}>
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
                  Copy or Scan The Address In The Next Screen
                </Text>
                <Text weight={500} size='12px'>
                  This is the address you are sending NFTs to.
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
                  Go To Your Wallet With The NFTs
                </Text>
                <Text weight={500} size='12px'>
                  This is the address you are sending NFTs from.
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
                  Paste Address from step 1 and click Send
                </Text>
                <Text weight={500} size='12px'>
                  Enter the address and pay the transaction fee.
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
                  Once confirmed, sent NFTs will show up here
                </Text>
                <Text weight={500} size='12px'>
                  Your sent NFTs are now in your Blockchain Wallet.
                </Text>
              </div>
            </Flex>
          </Padding>
        </Flex>
      </Flex>
    </Flex>
  )
}

type Props = OwnProps

export default ImportNFTs
