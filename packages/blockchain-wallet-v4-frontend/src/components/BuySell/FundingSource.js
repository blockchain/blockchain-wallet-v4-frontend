import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import { flex, spacing } from 'services/StyleService'

const capitalize = (s) => s[0].toUpperCase() + s.slice(1)

const FundingSource = ({ account }) => (
  <div style={{ ...flex('col'), ...spacing('ml-20') }}>
    {
      !account
        ? <Text size='12px' weight={300}>Account Needed</Text>
        : <Fragment>
          <Text size='14px' weight={300}>
            {`${capitalize(account.accountType)} `}
            <FormattedMessage id='buy.accountendingwith' defaultMessage='ending with' />
            {' ' + account.accountNumber}
          </Text>
          <Text size='12px' weight={300}>
            {account.name}
          </Text>
        </Fragment>
    }
  </div>
)

export default FundingSource
