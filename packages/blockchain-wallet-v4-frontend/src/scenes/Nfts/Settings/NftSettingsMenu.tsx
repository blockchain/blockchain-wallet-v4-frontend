import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { FIXED_HEADER_HEIGHT } from 'layouts/Nfts/NftsHeader'
import { media } from 'services/styles'

const Wrapper = styled.div`
  top: calc(${FIXED_HEADER_HEIGHT}px);
  position: sticky;
  transition: width 0.3s ease, min-width 0.3s ease;
  width: 256px;
  min-width: 256px;
  margin-right: 20px;
  padding: 24px;
  overflow: scroll;
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

const NftSettingsMenu: React.FC<Props> = () => {
  return (
    <Wrapper>
      <Text size='32px' weight={600} color='black'>
        <FormattedMessage id='copy.settings' defaultMessage='Settings' />
      </Text>
    </Wrapper>
  )
}

type Props = {}

export default NftSettingsMenu
