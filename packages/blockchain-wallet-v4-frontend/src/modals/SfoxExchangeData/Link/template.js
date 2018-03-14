import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import { Text } from 'blockchain-info-components'

import PlaidFrame from './iframe.js'
import BankAccounts from './BankAccounts'
import AddManually from './AddManually'
import { Row, ColLeft, ColRight, ColLeftInner, Info, Title, Subtitle } from '../styled'

const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const ManualLinkText = styled.span`
  display: flex;
  flex-direction: row;
  font-size: 13px;
  align-items: center;
  margin-top: 10px;
  a:first-of-type {
    color: ${props => props.theme['brand-secondary']};
    cursor: pointer;
    span {
      color: #545456;
      cursor: default;
    }
  }
`

const BankLink = (props) => {
  const { plaidUrl, enablePlaid, bankAccounts, onSetBankAccount, ui, toggleManual, setBankManually } = props

  return (
    <Row>
      <ColLeft>
        <ColLeftInner>
          <Title>
            <FormattedMessage id='sfoxexchangedata.link.title' defaultMessage='Link Account' />
          </Title>
          <Subtitle>
            <FormattedMessage id='sfoxexchangedata.link.subtitle' defaultMessage='Sync your bank account instantly by securely signing into your bank directly.' />
          </Subtitle>
          <Info>
            <FormattedMessage id='sfoxexchangedata.link.info' defaultMessage='You can also manually add your account by typing your routing number and account information. Please note that manually adding your bank account could take up to 4 business days to process.' />
          </Info>
          <Info>
            <FormattedMessage id='sfoxexchangedata.link.info2' defaultMessage='(PS: Your bank information will be sent directly to SFOX and will not be viewed by or saved to your Blockchain wallet.)' />
          </Info>
        </ColLeftInner>
      </ColLeft>
      <ColRight>
        <LinkContainer>
          <Text size='14px'>
            <FormattedMessage id='sfoxexchangedata.link.selectmethod' defaultMessage='Select Method To Link Your Bank Account' />
          </Text>
          {
            bankAccounts
              ? <BankAccounts data={bankAccounts.data} onSetBankAccount={onSetBankAccount} />
              : <PlaidFrame enablePlaid={enablePlaid} plaidUrl={plaidUrl} />
          }
        </LinkContainer>
        <ManualLinkText>
          <a onClick={toggleManual}>Or Manually Enter Account & Routing Information&nbsp;
          <span>(This can take up to 4 business days)</span>
          </a>
        </ManualLinkText>
        {
          ui.toggleManual
            ? <AddManually onSetBankManually={setBankManually} />
            : null
        }
      </ColRight>
    </Row>
  )
}

export default reduxForm({ form: 'sfoxUpload' })(BankLink)
