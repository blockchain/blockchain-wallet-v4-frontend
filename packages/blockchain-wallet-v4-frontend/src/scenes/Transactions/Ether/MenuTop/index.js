import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

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
const FilterStatuses = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 80%;
  margin-bottom: 5px;
`
const FilterSearch = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 20%;
`

const MenuTop = (props) => {
  return (
    <Wrapper>
      <Container>
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

export default reduxForm({ form: 'etherTransactionForm' })(MenuTop)
