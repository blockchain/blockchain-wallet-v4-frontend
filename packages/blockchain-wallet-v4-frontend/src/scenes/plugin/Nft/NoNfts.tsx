import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const Wrapper = styled(Flex)`
  flex-grow: 1;
  flex-direction: column;
`

const Message = styled(Text)`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: 0em;
  color: ${(props) => props.theme.white};
`

const AddNft = styled(Link)`
  height: 48px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.white};
  color: ${(props) => props.theme.black};
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-decoration: none;
  cursor: pointer;
`

export const NoNfts = () => {
  return (
    <Wrapper>
      <Message>
        <FormattedMessage id='plugin.scenes.nft.no_nfts' defaultMessage='No NFTs to show' />
      </Message>
      <AddNft to='/plugin/funding'>
        <FormattedMessage id='plugin.scenes.nft.add_nft' defaultMessage='Add NFT' />
      </AddNft>
    </Wrapper>
  )
}
