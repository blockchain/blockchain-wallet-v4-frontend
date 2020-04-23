import { FormattedMessage } from 'react-intl'
import { prop } from 'ramda'
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

const DualWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const DetailTable = styled.div`
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

const CodeWrapper = styled(Wrapper)`
  margin-right: 1.5rem;
`

const EthAddresses = ({
  addressInfo,
  legacyAddressInfo,
  showQrCode,
  toggleQrCode
}) => (
  <Wrapper color='grey000' showQrCode={showQrCode}>
    <ViewKeys showQrCode={showQrCode} toggleQrCode={toggleQrCode} />
    {showQrCode && (
      <DualWrapper>
        {legacyAddressInfo && (
          <KeyWrapper>
            <CodeWrapper>
              <QRCodeWrapper
                value={prop('priv', legacyAddressInfo)}
                size={230}
              />
            </CodeWrapper>
            <DetailTable>
              <DetailColTitle>
                <DetailRowText color='blue600' size='16px' weight={500}>
                  <FormattedMessage
                    id='scenes.settings.address.eth.legacy'
                    defaultMessage='Legacy Address Info'
                  />
                </DetailRowText>
              </DetailColTitle>
              <DetailColumn>
                <DetailRowText color='grey600' size='12px' weight={500}>
                  <FormattedMessage
                    id='copy.balance'
                    defaultMessage='Balance'
                  />
                </DetailRowText>
                <CoinDisplay coin='ETH' size='14px' weight={600}>
                  {prop('balance', legacyAddressInfo)}
                </CoinDisplay>
              </DetailColumn>

              <DetailColumn>
                <DetailRowText color='grey600' size='12px' weight={500}>
                  <FormattedMessage
                    id='copy.address'
                    defaultMessage='Address'
                  />
                </DetailRowText>

                <DataRowText
                  size='14px'
                  weight={600}
                  data-e2e='xlmPrivateKeyAddress'
                >
                  {prop('addr', legacyAddressInfo)}
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
                  {prop('priv', legacyAddressInfo)}
                </DataRowText>
              </DetailColumn>
            </DetailTable>
          </KeyWrapper>
        )}
        <KeyWrapper>
          <CodeWrapper>
            <QRCodeWrapper value={prop('priv', addressInfo)} size={230} />
          </CodeWrapper>
          <DetailTable>
            {legacyAddressInfo && (
              <DetailColTitle>
                <DetailRowText color='blue600' size='16px' weight={500}>
                  <FormattedMessage
                    id='scenes.settings.address.eth.address'
                    defaultMessage='Address Info'
                  />
                </DetailRowText>
              </DetailColTitle>
            )}
            <DetailColumn>
              <DetailRowText color='grey600' size='12px' weight={500}>
                <FormattedMessage id='copy.balance' defaultMessage='Balance' />
              </DetailRowText>
              <CoinDisplay coin='ETH' size='14px' weight={600}>
                {prop('balance', addressInfo)}
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
                {prop('addr', addressInfo)}
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
                {prop('priv', addressInfo)}
              </DataRowText>
            </DetailColumn>
          </DetailTable>
        </KeyWrapper>
      </DualWrapper>
    )}
  </Wrapper>
)

export default EthAddresses
