import React from 'react'
import { FormattedMessage } from 'react-intl'
import { colors, Icon } from '@blockchain-com/constellation'
import { compose } from 'redux'
import styled from 'styled-components'

import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import modalEnhancer from 'providers/ModalEnhancer'
import { useMedia } from 'services/styles'

const NumberCircle = styled.div`
  border-radius: 50%;
  width: 18px;
  height: 18px;
  padding: 8px;
  background: ${colors.grey000};
  text-align: center;
`

const GetFeatured = (props) => {
  const isTablet = useMedia('tablet')
  const { closeAllModals } = props
  return (
    <Modal size='medium'>
      <ModalHeader onClose={closeAllModals}>
        <Text color='grey900' size='18px' weight={600}>
          Get Featured On The NFT Homepage
        </Text>
      </ModalHeader>
      <ModalBody>
        <Text size='14px' weight={500}>
          We regularly check and select a hashtaged NFT to promote on the Blockchain.com NFT
          homepage
        </Text>
        <Flex alignItems='center' gap={8} style={{ padding: '1.5em 0em' }}>
          <NumberCircle>
            <Text color='grey600' weight={600}>
              1
            </Text>
          </NumberCircle>
          <div>
            <Text color='grey900' weight={600} size='16px'>
              Post your NFT
            </Text>
            <Text weight={500} size='12px'>
              Post a link to your Blockchain.com NFT on Twitter or Instagram
            </Text>
          </div>
        </Flex>
        <Flex alignItems='center' gap={8}>
          <NumberCircle>
            <Text color='grey600' weight={600}>
              2
            </Text>
          </NumberCircle>
          <div>
            <Text color='grey900' weight={600} size='16px'>
              Use a Hashtag
            </Text>
            <Text weight={500} size='12px'>
              Include <b>#BlockchainNFT</b> in your post
            </Text>
          </div>
        </Flex>
        <Flex alignItems='center' gap={8} style={{ padding: '1.5em 0em 0em' }}>
          <NumberCircle>
            <Text color='grey600' weight={600}>
              3
            </Text>
          </NumberCircle>
          <div>
            <Text color='grey900' weight={600} size='16px'>
              Follow Us
            </Text>
            <Text weight={500} size='12px'>
              Make sure to follow us on Twitter & Instagram
            </Text>
          </div>
        </Flex>
      </ModalBody>
      <ModalFooter align='spaced'>
        <Link href='https://twitter.com/blockchain' target='_blank'>
          <Button width={isTablet ? '150px' : '185px'} nature='primary' data-e2e='twitter'>
            <FormattedMessage id='copy.twitter' defaultMessage='Twitter' />
          </Button>
        </Link>

        <Link href='https://www.instagram.com/blockchainofficial' target='_blank'>
          <Button width={isTablet ? '150px' : '185px'} nature='primary' data-e2e='instagram'>
            <FormattedMessage id='copy.instagram' defaultMessage='Instagram' />
          </Button>
        </Link>
      </ModalFooter>
    </Modal>
  )
}
const enhance = compose(modalEnhancer('GET_FEATURED'))

export default enhance(GetFeatured)
