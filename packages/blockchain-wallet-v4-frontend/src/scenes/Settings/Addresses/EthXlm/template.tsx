import { AddressType } from './.'
import { toUpper } from 'ramda'
import media from 'services/ResponsiveService'
import QrCodeAddressInfo from '../QrCodeAddressInfo'
import React from 'react'
import styled from 'styled-components'
import ViewKeys from '../ViewKeys'

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
  legacyAddressInfo,
  isLegacy,
  showQrCode,
  toggleQrCode
}: {
  addressInfo: AddressType
  coin: 'eth' | 'xlm'
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
            coin={toUpper(coin)}
            isEth={isEth}
            isLegacy={isLegacy}
            showLegacyTitle={isEth}
          />
        )}
        <QrCodeAddressInfo
          {...addressInfo}
          coin={toUpper(coin)}
          isEth={isEth}
          isLegacy={isLegacy}
        />
      </DualWrapper>
    )}
  </Wrapper>
)

export default EthXlmAddresses
