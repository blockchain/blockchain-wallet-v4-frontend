import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button } from 'components/legacy/Button'
import TextArea from 'components/generic/TextArea'
import Dropdown from 'components/generic/Dropdown'
import Text from 'components/generic/Text'

const RequestBitcoinContainer = styled.div`
  height: 100%;
  width: 100%;
`
const RequestBitcoinHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.grayLighter};
`
const RequestBitcoinContent = styled.div`
  padding: 20px;
`
const RequestBitcoinRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  padding: 10px 0;
`

const RequestBitcoin = (props) => {
  return (
    <RequestBitcoinContainer>
      <RequestBitcoinHeader>
        <Text size='1.4rem'>
          <i className='icon-send padding-right-10' />
          <FormattedMessage id='components.shared.requestbitcoin.request' defaultMessage='Request' />
        </Text>
      </RequestBitcoinHeader>
      <RequestBitcoinContent>
        <RequestBitcoinRow>
          <Text size='0.9rem' weight={500} transform='capitalize'>
            <FormattedMessage id='components.shared.requestbitcoin.share' defaultMessage='Copy & share address:' />
          </Text>
        </RequestBitcoinRow>
        <RequestBitcoinRow>
          <Text size='0.9rem' weight={500} transform='capitalize'>
            <FormattedMessage id='components.shared.requestbitcoin.amount' defaultMessage='Enter amount:' />
          </Text>
        </RequestBitcoinRow>
        <RequestBitcoinRow>
          <Text size='0.9rem' weight={500} transform='capitalize'>
            <FormattedMessage id='components.shared.requestbitcoin.to' defaultMessage='Receive to:' />
          </Text>
          <Dropdown items={props.addresses} callback={props.selectAddress} />
        </RequestBitcoinRow>
        <RequestBitcoinRow>
          <Text size='0.9rem' weight={500} transform='capitalize'>
            <FormattedMessage id='components.shared.requestbitcoin.description' defaultMessage='Description:' />
          </Text>
          <TextArea placeholder="What's this transaction for?" fullwidth />
        </RequestBitcoinRow>
        <RequestBitcoinRow>
          <Button type='secondary' fullwidth>
            <FormattedMessage id='components.shared.requestbitcoin.next' defaultMessage='Next' />
          </Button>
        </RequestBitcoinRow>
      </RequestBitcoinContent>
    </RequestBitcoinContainer>
  )
}

export default RequestBitcoin
