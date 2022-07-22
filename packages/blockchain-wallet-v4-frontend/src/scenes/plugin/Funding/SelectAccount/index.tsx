import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Icon } from '@blockchain-com/constellation'
import { IconCheckCircle } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { actions } from 'data'

const List = styled.ul`
  width: 100%;
  margin: 60px 0 0;
  padding: 0;
  list-style: none;
  .item {
    margin-top: 30px;
    padding: 0;
    display: flex;
    align-items: center;
    background: none;
    border: none;
  }
`
export const ListItemContent = styled.div`
  margin-left: 16px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  font-size: 16px;
  line-height: 24px;
`
const ButtonWrapper = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  align-items: end;
`

export const Continue = styled(Link)`
  width: 100%;
  padding: 16px;
  background: ${(props) => props.theme.white};
  border-radius: 8px;
  color: ${(props) => props.theme.exchangeLogin};
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-decoration: none;
  cursor: pointer;
`

export const FundingHeading = styled(Text)`
  font-size: 20px;
  margin: 34px 0 67px;
  color: ${(props) => props.theme.white};
`
export const Subtitle = styled(Text)`
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.grey400};
`

const Balance = styled(Text)`
  display: 'flex';
  justify-content: 'right';
`

const LeftAlignedText = styled(Text)`
  text-align: left;
`
const RightAlignedText = styled(Text)`
  text-align: right;
`

const ListElement = styled.li`
  cursor: pointer;
`
const AnotherWalletLabel = styled(Text)`
  margin-left: 16px;
`
const SelectAccount = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>('Trading')

  return (
    <>
      <FundingHeading style={{ marginBottom: '12px' }}>
        <FormattedMessage id='scenes.plugin.funding.add_crypto' defaultMessage='Add Crypto' />
      </FundingHeading>
      <Subtitle>
        <FormattedMessage
          id='scenes.plugin.funding.description'
          defaultMessage='You can transfer crypto from your Blockchain account or another wallet'
        />
        <br />
        <Link to='/'>
          <FormattedMessage id='buttons.learn_more' defaultMessage='Learn more' />
        </Link>
      </Subtitle>
      <List>
        <ListElement>
          <button type='button' className='item' onClick={() => setSelectedAccount('Trading')}>
            <Icon color='white800' label='IconCheckCircle' size='md'>
              <IconCheckCircle />
            </Icon>
            <ListItemContent>
              <Text color='white'>
                <FormattedMessage
                  id='scenes.debit_card.dashboard.funds.type.trading_account'
                  defaultMessage='Trading Account'
                />
              </Text>
              <Balance color='white'>
                <FiatDisplay color='grey400' size='12px' weight={500} coin='ETH' />
              </Balance>
              <LeftAlignedText size='14px' lineHeight='20px'>
                <FormattedMessage
                  id='scenes.settings.addresses.menutop.eth'
                  defaultMessage='Ethereum'
                />
              </LeftAlignedText>
              <RightAlignedText size='14px' lineHeight='20px' />
            </ListItemContent>
          </button>
        </ListElement>
        <li style={{ cursor: 'pointer' }}>
          <button type='button' className='item' onClick={() => setSelectedAccount('')}>
            <Icon color='white800' label='IconCheckCircle' size='md'>
              <IconCheckCircle />
            </Icon>
            <AnotherWalletLabel color='white'>
              <FormattedMessage
                id='scenes.plugin.funding.another_wallet'
                defaultMessage='Another wallet'
              />
            </AnotherWalletLabel>
          </button>
        </li>
      </List>
      <ButtonWrapper>
        <Continue to={`/extension/funding/${selectedAccount ? 'amount' : 'receive'}`}>
          <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
        </Continue>
      </ButtonWrapper>
    </>
  )
}

export default SelectAccount
