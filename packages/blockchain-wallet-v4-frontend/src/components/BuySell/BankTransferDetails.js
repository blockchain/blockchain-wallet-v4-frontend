import { FormattedMessage } from 'react-intl'
import { spacing } from 'services/StyleService'
import { Text } from 'blockchain-info-components'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const BankTransferDetailsTable = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.grey000};
  padding: 15px;
  border-radius: 6px;
`
const DetailsRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 6px 0px;
  div:first-of-type {
    margin-right: 10px;
  }
`
const BankTransferDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${props => (props.inModal ? `0px` : `30px`)};
  border: ${props =>
    props.inModal ? `none` : `1px solid ${props.theme.grey000}`};
  margin-bottom: 15px;
`

const BankTransferDetails = ({ trade, inModal }) => {
  const holderAddress = trade.bankAccount.holderAddress
  const bankAddress = trade.bankAccount.bankAddress

  return (
    <BankTransferDetailsWrapper inModal>
      {!inModal ? (
        <Text size='30px' weight={500} style={spacing('mb-10')}>
          <FormattedMessage
            id='coinify.banktransferdetails.header'
            defaultMessage='Bank Transfer Order Details'
          />
        </Text>
      ) : null}
      <Text size='14px' weight={400} style={spacing('mb-15')}>
        <FormattedMessage
          id='coinify.banktransferdetails.sendamount'
          defaultMessage="Please send {amount} {currency} to Coinify's bank account below {within}."
          values={{
            amount: (
              <span style={{ fontWeight: '400' }}>
                {trade.sendAmount / 100}
              </span>
            ),
            currency: (
              <span style={{ fontWeight: '400' }}>{trade.inCurrency}</span>
            ),
            within: (
              <span style={{ fontWeight: '400' }}>
                within the next 48 hours
              </span>
            )
          }}
        />
      </Text>
      <Text size='14px' weight={400} style={spacing('mb-30')}>
        <FormattedMessage
          id='coinify.banktransferdetails.directions'
          defaultMessage='Funds must come from your bank account, which needs to be in the same name as your government issued ID. Coinify will reject any transfers from third party accounts not in your name.'
        />
      </Text>
      <BankTransferDetailsTable>
        <DetailsRow>
          <Text size='13px' weight={500}>
            <FormattedMessage
              id='coinify.banktransferdetails.recipientname'
              defaultMessage='Recipient Name:'
            />
          </Text>
          <Text size='13px' weight={400}>
            {`${trade.bankAccount.holderName}`}
          </Text>
        </DetailsRow>
        <DetailsRow>
          <Text size='13px' weight={500}>
            <FormattedMessage
              id='coinify.banktransferdetails.recipientaddress'
              defaultMessage='Recipient Address:'
            />
          </Text>
          <Text size='13px' weight={400}>
            {`${holderAddress.street}, ${holderAddress.zipcode} ${holderAddress.city}, ${holderAddress.country}`}
          </Text>
        </DetailsRow>
        <DetailsRow>
          <Text size='13px' weight={500}>
            <FormattedMessage
              id='coinify.banktransferdetails.iban'
              defaultMessage='IBAN:'
            />
          </Text>
          <Text size='13px' weight={400}>
            {`${trade.bankAccount.number}`}
          </Text>
        </DetailsRow>
        <DetailsRow>
          <Text size='13px' weight={500}>
            <FormattedMessage
              id='coinify.banktransferdetails.bic'
              defaultMessage='BIC:'
            />
          </Text>
          <Text size='13px' weight={400}>
            {`${trade.bankAccount.bic}`}
          </Text>
        </DetailsRow>
        <DetailsRow>
          <Text size='13px' weight={500}>
            <FormattedMessage
              id='coinify.banktransferdetails.bankaddress'
              defaultMessage='Bank:'
            />
          </Text>
          <Text size='13px' weight={400}>
            {`${trade.bankAccount.bankName}, ${bankAddress.street}, ${bankAddress.zipcode} ${bankAddress.city}, ${bankAddress.country}`}
          </Text>
        </DetailsRow>
        <DetailsRow>
          <Text size='13px' weight={500}>
            <FormattedMessage
              id='coinify.banktransferdetails.ref'
              defaultMessage='Reference/Message:'
            />
          </Text>
          <Text size='13px' weight={400}>
            {`Order ID ${trade.bankAccount.referenceText}`}
          </Text>
          <Text size='12px' weight={400} color='error' style={spacing('pl-10')}>
            <FormattedMessage
              id='coinify.banktransferdetails.include'
              defaultMessage='*Must be included*'
            />
          </Text>
        </DetailsRow>
      </BankTransferDetailsTable>
    </BankTransferDetailsWrapper>
  )
}

BankTransferDetails.propTypes = {
  trade: PropTypes.shape({
    bankAccount: PropTypes.object.isRequired,
    sendAmount: PropTypes.number.isRequired,
    inCurrency: PropTypes.string.isRequired
  })
}

export default BankTransferDetails
