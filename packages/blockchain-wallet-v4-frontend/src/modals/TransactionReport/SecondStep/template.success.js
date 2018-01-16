import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { CSVLink } from 'react-csv-2'
import { Text } from 'blockchain-info-components'

const DownloadContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  & > :last-child { margin-left: 10px; }
`
const DownloadLink = styled(CSVLink)`
  text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: ${props => props.theme['brand-secondary']};
`

const TransactionReport = (props) => {
  const { position, total, close, closeAll, ...rest } = props
  const { data, filename } = rest

  return (
    <DownloadContainer>
      <Text>Hello</Text>
      <DownloadLink data={data} filename={filename} target='_blank'>
        <FormattedMessage id='modals.secondstep.transactionreport.download' defaultMessage='Download' />
      </DownloadLink>
    </DownloadContainer>
  )
}

export default TransactionReport
