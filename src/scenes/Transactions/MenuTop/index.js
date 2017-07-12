import React from 'react'
import styled from 'styled-components'
import { Field } from 'redux-form'

import { singleForm } from 'components/providers/FormProvider'
import { Form } from 'components/generic/Form'
import { DropdownAddresses } from 'components/shared/Form'
import Status from './Status'
import Search from './Search'

const Wrapper = styled.div`
  padding: 8px 30px;
  box-sizing: border-box;
  background-color: #F5F7F9;
  border-bottom: 1px solid #DDDDDD;
`
const HorizontalForm = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  @media(min-width: 992px) { flex-direction: row; }
`
const Filter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 5px;
`
const FilterAddresses = styled(Filter)`
  flex-grow: 1;
  order: 2; 
  @media(min-width: 992px) { order: 1; } 
`
const FilterStatuses = styled(Filter)`
  flex-grow: 2;
  order: 1; 
  @media(min-width: 992px) { order: 2; } 
`
const FilterSearch = styled(Filter)`
  flex-grow: 1;
  order: 3;
  @media(min-width: 992px) { order: 3; } 
`

const MenuTop = (props) => {
  return (
    <Wrapper>
      <HorizontalForm>
        <FilterAddresses>
          <Field name='address' component={DropdownAddresses} />
        </FilterAddresses>
        <FilterStatuses>
          <Field name='status' component={Status} />
        </FilterStatuses>
        <FilterSearch>
          <Field name='search' component={Search} />
        </FilterSearch>
      </HorizontalForm>
    </Wrapper>
  )
}

export default singleForm('transactionForm')(MenuTop)
