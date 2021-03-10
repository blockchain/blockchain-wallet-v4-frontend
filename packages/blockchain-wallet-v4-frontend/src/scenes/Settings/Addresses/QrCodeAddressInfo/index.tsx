import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import QRCodeWrapper from 'components/QRCode/Wrapper'
import { media } from 'services/styles'

const KeyWrapper = styled.div`
  display: flex;
  margin-top: 1.5rem;
  padding-right: 1.5rem;
`

const DetailTable = styled.div`
  margin-top: 1.5rem;

  > div {
    word-break: break-word;
  }

  > div:not(:first-child) {
    margin-top: 18px;
  }
`

const DetailColumn = styled.div`
  display: flex;
  flex-direction: column;
`

const DetailColTitle = styled(DetailColumn)`
  border-bottom: ${props => `solid 1px ${props.theme.grey000}`};
  padding-bottom: 0.5rem;
`

const DetailRowText = styled(Text)`
  white-space: nowrap;
`

const DataRowText = styled(Text)`
  word-wrap: break-word;
`

const CodeWrapper = styled.div`
  display: inline-block;
  margin-right: 1.5rem;
  border: none;
  border-radius: 1rem;

  ${media.laptop`
    flex-direction: column;
  `};
`

const QrCodeAddressInfo = ({
  addr,
  balance,
  coin,
  isEth,
  isLegacy,
  priv,
  showLegacyTitle
}: {
  addr: string
  balance: number
  coin: 'XLM' | 'ETH'
  isEth?: boolean
  isLegacy?: boolean
  priv: string
  showLegacyTitle?: boolean
}) => (
  <KeyWrapper>
    <CodeWrapper>
      <QRCodeWrapper value={priv} size={230} />
    </CodeWrapper>
    <DetailTable>
      {isEth && isLegacy ? (
        showLegacyTitle ? (
          <DetailColTitle>
            <DetailRowText color='blue600' size='16px' weight={500}>
              <FormattedMessage
                id='scenes.settings.addresses.eth.legacy'
                defaultMessage='Legacy Address Info'
              />
            </DetailRowText>
          </DetailColTitle>
        ) : (
          <DetailColTitle>
            <DetailRowText color='blue600' size='16px' weight={500}>
              <FormattedMessage
                id='scenes.settings.addresses.eth.address'
                defaultMessage='Address Info'
              />
            </DetailRowText>
          </DetailColTitle>
        )
      ) : null}
      <DetailColumn>
        <DetailRowText color='grey600' size='12px' weight={500}>
          <FormattedMessage id='copy.balance' defaultMessage='Balance' />
        </DetailRowText>
        <CoinDisplay coin={coin} size='14px' weight={600}>
          {balance}
        </CoinDisplay>
      </DetailColumn>
      <DetailColumn>
        <DetailRowText color='grey600' size='12px' weight={500}>
          <FormattedMessage id='copy.address' defaultMessage='Address' />
        </DetailRowText>

        <DataRowText size='14px' weight={600} data-e2e='xlmPrivateKeyAddress'>
          {addr}
        </DataRowText>
      </DetailColumn>
      <DetailColumn>
        <DetailRowText color='grey600' size='12px' weight={500}>
          <FormattedMessage
            id='copy.private_key'
            defaultMessage='Private Key'
          />
        </DetailRowText>

        <DataRowText size='14px' weight={600} data-e2e='xlmPrivateKeyPrivKey'>
          {priv}
        </DataRowText>
      </DetailColumn>
    </DetailTable>
  </KeyWrapper>
)

export default QrCodeAddressInfo
