import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

import CheckBox from '../../../../icons/BackIcon'

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
export const ListItem = styled.div`
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
  background: #65a5ff;
  border-radius: 8px;
  color: #0e121b;
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
  color: white;
`

export const SelectAccount = (props) => {
  const { path } = props.match
  const [selectedAccount, setSelectedAccount] = useState<string>('Trading')

  return (
    <>
      <FundingHeading style={{ marginBottom: 0 }}>Add crypto</FundingHeading>
      <Text size='14px' lineHeight='20px' style={{ color: '#98A1B2', marginTop: '12px' }}>
        You can transfer crypto from your Blockchain account or another wallet
        <Link to='/' style={{ display: 'block' }}>
          Learn more
        </Link>
      </Text>
      <List>
        <li style={{ cursor: 'pointer' }}>
          <button type='button' className='item' onClick={() => setSelectedAccount('Trading')}>
            <CheckBox
              innerColor={selectedAccount ? '#619FF7' : 'transparent'}
              outerColor={selectedAccount ? '#619FF7' : '#98A1B2'}
            />
            <ListItem>
              <Text color='white'>Trading Account</Text>
              <Text color='white' style={{ textAlign: 'right' }}>
                $3,225.01
              </Text>
              <Text size='14px' lineHeight='20px' style={{ textAlign: 'left' }}>
                Ethereum
              </Text>
              <Text size='14px' lineHeight='20px' style={{ textAlign: 'right' }}>
                5.3655 ETH
              </Text>
            </ListItem>
          </button>
        </li>
        <li style={{ cursor: 'pointer' }}>
          <button type='button' className='item' onClick={() => setSelectedAccount('')}>
            <CheckBox
              innerColor={selectedAccount ? 'transparent' : '#619FF7'}
              outerColor={selectedAccount ? '#98A1B2' : ' #619FF7'}
            />
            <Text color='white' style={{ marginLeft: '16px' }}>
              Another wallet
            </Text>
          </button>
        </li>
      </List>
      <ButtonWrapper>
        <Continue to={`/extension/funding/${selectedAccount ? 'amount' : 'receive'}`}>
          Continue
        </Continue>
      </ButtonWrapper>
    </>
  )
}
