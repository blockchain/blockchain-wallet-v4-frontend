import React from 'react'
import styled from 'styled-components'

import { media } from 'services/styles'

import QrCodeAddressInfo from '../QrCodeAddressInfo'
import ViewKeys from '../ViewKeys'
import { AddressType } from './.'

const Wrapper = styled.div<{ showQrCode?: boolean }>`
  display: ${props => (props.showQrCode ? 'flex' : 'inline-block')};
  border: ${props =>
    props.color ? `solid 1px ${props.theme[props.color]}` : 'none'};
  border-radius: 1rem;

  ${media.laptop`
    flex-direction: column;
  `};
`

const DualWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const EthXlmAddresses = ({
  addressInfo,
  coin,
  isEth,
  isLegacy,
  legacyAddressInfo,
  showQrCode,
  toggleQrCode
}: {
  addressInfo: AddressType
  coin: 'ETH'
  isEth: boolean
  isLegacy: boolean
  legacyAddressInfo: AddressType
  showQrCode: boolean
  toggleQrCode: () => void
}) => (
  <Wrapper color='grey000' showQrCode={showQrCode}>
    <ViewKeys showQrCode={showQrCode} toggleQrCode={toggleQrCode} />
    {showQrCode && (
      <DualWrapper>
        {isEth && legacyAddressInfo && (
          <QrCodeAddressInfo
            {...legacyAddressInfo}
            coin={coin}
            isEth={isEth}
            isLegacy={isLegacy}
            showLegacyTitle={isEth}
          />
        )}
        <QrCodeAddressInfo
          {...addressInfo}
          coin={coin}
          isEth={isEth}
          isLegacy={isLegacy}
        />
      </DualWrapper>
    )}
  </Wrapper>
)

export default EthXlmAddresses
