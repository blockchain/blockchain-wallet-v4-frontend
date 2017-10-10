import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { SelectBoxAddresses } from 'components/Form'
import TransactionMenuStatus from 'components/TransactionMenuStatus'
import TransactionSearch from 'components/TransactionSearch'

const Wrapper = styled.div`
  padding: 8px 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['gray-1']};
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`
const Container = styled.div`
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
      <Container>
        <FilterAddresses>
          <Field name='source' component={SelectBoxAddresses} />
        </FilterAddresses>
        <FilterStatuses>
          <Field name='status' component={TransactionMenuStatus} />
        </FilterStatuses>
        <FilterSearch>
          <Field name='search' component={TransactionSearch} />
        </FilterSearch>
      </Container>
    </Wrapper>
  )
}

export default reduxForm({ form: 'bitcoinTransactionForm' })(MenuTop)
