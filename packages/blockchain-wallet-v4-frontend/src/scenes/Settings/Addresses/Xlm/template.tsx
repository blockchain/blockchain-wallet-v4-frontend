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

const XlmAddresses = ({
  addressInfo,
  coin,
  showQrCode,
  toggleQrCode
}: {
  addressInfo: AddressType
  coin: 'XLM'
  showQrCode: boolean
  toggleQrCode: () => void
}) => (
  <Wrapper color='grey000' showQrCode={showQrCode}>
    <ViewKeys showQrCode={showQrCode} toggleQrCode={toggleQrCode} />
    {showQrCode && (
      <DualWrapper>
        <QrCodeAddressInfo {...addressInfo} coin={coin} />
      </DualWrapper>
    )}
  </Wrapper>
)

export default XlmAddresses
