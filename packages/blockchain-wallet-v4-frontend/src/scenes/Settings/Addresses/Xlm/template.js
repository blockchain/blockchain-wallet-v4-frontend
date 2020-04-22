import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import media from 'services/ResponsiveService'
import QRCodeWrapper from 'components/QRCodeWrapper'
import React from 'react'
import styled from 'styled-components'
import ViewKeys from '../ViewKeys'

const Wrapper = styled.div`
  display: ${props => (props.showQrCode ? 'flex' : 'inline-block')};
  border: ${props =>
    props.color ? `solid 1px ${props.theme[props.color]}` : 'none'};
  border-radius: 1rem;

  ${media.laptop`
    flex-direction: column;
  `};
`

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

const DetailRowText = styled(Text)`
  white-space: nowrap;
`

const DataRowText = styled(Text)`
  word-wrap: break-word;
`

const CodeWrapper = styled(Wrapper)`
  margin-right: 1.5rem;
`

const XlmAddresses = ({
  addr,
  balance,
  privateKey,
  showQrCode,
  toggleQrCode
}) => (
  <Wrapper color='grey000' showQrCode={showQrCode}>
    <ViewKeys showQrCode={showQrCode} toggleQrCode={toggleQrCode} />
    {showQrCode && (
      <KeyWrapper>
        <CodeWrapper>
          <QRCodeWrapper value={privateKey} size={230} />
        </CodeWrapper>
        <DetailTable>
          <DetailColumn>
            <DetailRowText color='grey600' size='12px' weight={500}>
              <FormattedMessage id='copy.balance' defaultMessage='Balance' />
            </DetailRowText>
            <CoinDisplay coin='XLM' size='14px' weight={600}>
              {balance}
            </CoinDisplay>
          </DetailColumn>

          <DetailColumn>
            <DetailRowText color='grey600' size='12px' weight={500}>
              <FormattedMessage id='copy.address' defaultMessage='Address' />
            </DetailRowText>

            <DataRowText
              size='14px'
              weight={600}
              data-e2e='xlmPrivateKeyAddress'
            >
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

            <DataRowText
              size='14px'
              weight={600}
              data-e2e='xlmPrivateKeyPrivKey'
            >
              {privateKey}
            </DataRowText>
          </DetailColumn>
        </DetailTable>
      </KeyWrapper>
    )}
  </Wrapper>
)

export default XlmAddresses
