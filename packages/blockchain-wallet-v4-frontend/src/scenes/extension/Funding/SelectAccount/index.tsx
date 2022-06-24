import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { getBalanceSelector } from 'components/Balances/selectors'
import { getTotalBalance } from 'components/Balances/total/selectors'
import FiatDisplay from 'components/Display/FiatDisplay'
import { actions } from 'data'

import { RootState } from '../../../../data/rootReducer'
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

const SelectAccount = (props) => {
  const state = useSelector((state: RootState) => state)
  const [selectedAccount, setSelectedAccount] = useState<string>('Trading')
  const {
    coins: {
      data: { totalBalance }
    }
  } = props
  const balance = getBalanceSelector('ETH')(state).getOrElse(0).valueOf()

  return (
    <>
      <FundingHeading style={{ marginBottom: '12px' }}>Add crypto</FundingHeading>
      <Subtitle>
        You can transfer crypto from your Blockchain account or another wallet <br />
        <Link to='/'>Learn more</Link>
      </Subtitle>
      <List>
        <li style={{ cursor: 'pointer' }}>
          <button type='button' className='item' onClick={() => setSelectedAccount('Trading')}>
            <CheckBox
              innerColor={selectedAccount ? '#619FF7' : 'transparent'}
              outerColor={selectedAccount ? '#619FF7' : '#98A1B2'}
            />
            <ListItemContent>
              <Text color='white'>Trading Account</Text>
              <Text color='white' style={{ display: 'flex', justifyContent: 'right' }}>
                <FiatDisplay
                  color='grey400'
                  size='12px'
                  weight={500}
                  coin='ETH'
                  style={{ textAlign: 'right' }}
                >
                  {balance}
                </FiatDisplay>
              </Text>
              <Text size='14px' lineHeight='20px' style={{ textAlign: 'left' }}>
                Ethereum
              </Text>
              <Text size='14px' lineHeight='20px' style={{ textAlign: 'right' }}>
                {`ETH ${(balance / 10e18).toFixed(6)}`}
              </Text>
            </ListItemContent>
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
          <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
        </Continue>
      </ButtonWrapper>
    </>
  )
}

const mapStateToProps = (state) => ({
  coins: getTotalBalance(state)
})

const mapDispatchToProps = (dispatch) => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectAccount)
