import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
// import { spacing } from 'services/StyleService'

const BankTransferDetailsTable = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme['gray-2']};
  background-color: ${props => props.theme['white-blue']};
`
const DetailsRow = styled.div`
  display: flex;
  flex-direction: row;
`
const BankTransferDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const BankTransferDetails = ({ trade, holderAddress, bankAddress }) => (
  <BankTransferDetailsWrapper>
    <Text size='30px' weight={400}>
      <FormattedMessage id='coinify.banktransferdetails.header' defaultMessage='Bank Transfer Order Details' />
    </Text>
    <Text size='14px' weight={300}>
      <FormattedMessage id='coinify.banktransferdetails.sendamount' defaultMessage="Please send {amount} {currency} to Coinify's bank account below within the next 48 hours." values={{ amount: (trade.sendAmount / 100), curency: trade.inCurrency }} />
    </Text>
    <Text size='14px' weight={300}>
      <FormattedMessage id='coinify.banktransferdetails.directions' defaultMessage='Funds must come from your bank account, which needs to be in the same name as your government issued ID. Coinify will reject any transfers from third party accounts not in your name.' />
    </Text>
    <BankTransferDetailsTable>
      <DetailsRow>
        <Text size='13px' weight={400}>
          <FormattedMessage id='coinify.banktransferdetails.recipientname' defaultMessage='Recipient Name:' />
        </Text>
        <Text size='13px' weight={300}>
          { `${trade.bankAccount.holderName}` }
        </Text>
      </DetailsRow>
      <DetailsRow>
        <Text size='13px' weight={400}>
          <FormattedMessage id='coinify.banktransferdetails.recipientaddress' defaultMessage='Recipient Address:' />
        </Text>
        <Text size='13px' weight={300}>
          { `${holderAddress.street}, ${holderAddress.zipcode} ${holderAddress.city}, ${holderAddress.country}` }
        </Text>
      </DetailsRow>
      <DetailsRow>
        <Text size='13px' weight={400}>
          <FormattedMessage id='coinify.banktransferdetails.iban' defaultMessage='IBAN:' />
        </Text>
        <Text size='13px' weight={300}>
          { `${trade.bankAccount.number}` }
        </Text>
      </DetailsRow>
      <DetailsRow>
        <Text size='13px' weight={400}>
          <FormattedMessage id='coinify.banktransferdetails.bic' defaultMessage='BIC:' />
        </Text>
        <Text size='13px' weight={300}>
          { `${trade.bankAccount.bic}` }
        </Text>
      </DetailsRow>
      <DetailsRow>
        <Text size='13px' weight={400}>
          <FormattedMessage id='coinify.banktransferdetails.bankaddress' defaultMessage='Bank:' />
        </Text>
        <Text size='13px' weight={300}>
          { `${trade.bankAccount.bankName}, ${bankAddress.street}, ${bankAddress.zipcode} ${bankAddress.city}, ${bankAddress.country}` }
        </Text>
      </DetailsRow>
      <DetailsRow>
        <Text size='13px' weight={400}>
          <FormattedMessage id='coinify.banktransferdetails.ref' defaultMessage='Reference/Message:' />
        </Text>
        <Text size='13px' weight={300}>
          { `Order ID ${trade.bankAccount.referenceText}` }
        </Text>
        <Text size='12px' weight={300} color='error'>
          <FormattedMessage id='coinify.banktransferdetails.include' defaultMessage='*Must be included*' />
        </Text>
      </DetailsRow>
    </BankTransferDetailsTable>
  </BankTransferDetailsWrapper>
)

export default BankTransferDetails
