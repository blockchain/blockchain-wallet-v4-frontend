import React from 'react'
import styled from 'styled-components'
import { Text } from 'blockchain-info-components'
import PropTypes from 'prop-types'
import { prop } from 'ramda'

const BankInfo = styled.div`
  display: flex;
  flex-direction: row;
  padding: 25px 30px;
  border: 1px solid #ddd;
  input[type='radio'] {
    display: none;
  }
  input[type='radio']:checked + label:before {
    content: '';
    width: 16px;
    height: 16px;
    background-color: #004a7c;
  }
  margin: 0px;
`
const BankLabel = styled.label`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  ::before {
    content: '';
    width: 16px;
    height: 16px;
    min-width: 16px;
    border-radius: 8px;
    background-color: white;
    border: 1px solid #004a7c;
    -webkit-transition: background-color 0.2s;
    -o-transition: background-color 0.2s;
    transition: background-color 0.2s;
  }
`
const BankMeta = styled.div`
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`

const Bank = ({ bank, onInputClick }) => (
  <BankInfo key={prop('account_id', bank)}>
    <input
      type='radio'
      name='bank-filled'
      value={bank}
      id={prop('account_id', bank)}
      onClick={() => onInputClick(prop('account_id', bank))}
    />
    <BankLabel htmlFor={prop('account_id', bank)}>
      <BankMeta>
        <Text size='16px'>
          {prop('name', bank)} ending in {prop('mask', bank)}
        </Text>
      </BankMeta>
    </BankLabel>
  </BankInfo>
)

Bank.propTypes = {
  bank: PropTypes.shape({
    account_id: PropTypes.number,
    name: PropTypes.string,
    mask: PropTypes.number
  })
}

export default Bank
