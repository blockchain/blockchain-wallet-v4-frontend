import React from 'react'
import styled from 'styled-components'
import { Text } from 'blockchain-info-components'

const BankInfo = styled.div`
  display: flex;
  flex-direction: row;
  padding: 25px 30px;
  border: 1px solid #DDD;
  input[type="radio"] {
    display: none;
  }
  input[type="radio"]:checked + label:before {
    content: '';
    width: 16px;
    height: 16px;
    background-color: #004a7c;
  }
  margin: 0px;
`
const BankName = styled(Text)`
  text-transform: capitalize;
  cursor: pointer;
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

const Bank = ({bank, onInputClick}) => (
  <BankInfo key={bank._id}>
    <input type='radio' name='bank' value={bank} id={bank._id} onClick={() => onInputClick(bank._id)} />
    <BankLabel htmlFor={bank._id}>
      <BankMeta>
        <Text size='16px'>
          {bank.meta.name} ending in {bank.meta.number}
        </Text>
        <BankName size='14px'>
          {bank.institution_type} Bank
        </BankName>
      </BankMeta>
    </BankLabel>
  </BankInfo>
)

export default Bank
