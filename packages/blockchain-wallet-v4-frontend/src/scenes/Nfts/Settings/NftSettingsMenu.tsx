import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { FIXED_HEADER_HEIGHT } from 'layouts/Nfts/NftsHeader'
import { media } from 'services/styles'

const Wrapper = styled.div`
  width: 256px;
  min-width: 256px;
  padding: 24px;
  overflow: scroll;
  box-sizing: border-box;
  height: calc(100vh - ${FIXED_HEADER_HEIGHT}px);
  border-right: 1px solid ${(props) => props.theme.grey000};
  background: ${(props) => props.theme.white};
  ${media.tablet`
    display: block;
    box-sizing: border-box;
    z-index: 1000;
    height: 100vh;
    width: 100%;
    position: fixed;
    padding: 20px;
    top: ${FIXED_HEADER_HEIGHT}px;
    bottom: 0;
    left: 0;
    right: 0;
  `}
`

const List = styled.div`
  margin-top: 20px;
`
const Item = styled.div<{ isActive: boolean; pointer: boolean }>`
  display: flex;
  align-items: center;
  height: 32px;
  padding-left: 8px;
  cursor: ${(props) => (props.pointer ? 'pointer' : 'not-allowed')};
  border-left: 3px solid ${(props) => (props.isActive ? props.theme.blue600 : props.theme.grey000)};
`

const NftSettingsMenu: React.FC<Props> = () => {
  return (
    <Wrapper>
      <Text size='32px' weight={600} color='black'>
        <FormattedMessage id='copy.settings' defaultMessage='Settings' />
      </Text>
      <List>
        {/* TODO: user profile */}
        {/* <Item pointer={false} style={{ opacity: 0.5 }} isActive={false}>
          <Text size='14px' weight={600}>
            <FormattedMessage id='copy.profile' defaultMessage='Profile' />
          </Text>
        </Item> */}
        <Item pointer isActive role='button'>
          <Text size='14px' weight={600} color='blue600'>
            <FormattedMessage id='copy.notifications' defaultMessage='Notifications' />
          </Text>
        </Item>
      </List>
    </Wrapper>
  )
}

type Props = {}

export default NftSettingsMenu
