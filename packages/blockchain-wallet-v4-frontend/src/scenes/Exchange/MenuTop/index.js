import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { Form } from 'components/Form'
import Status from './Status'

const Wrapper = styled.div`
  padding: 8px 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['gray-1']};
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`
const HorizontalForm = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  @media(min-width: 992px) { flex-direction: row; }
`
const Filter = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 5px;
`

const FilterStatuses = styled(Filter)`
  flex-grow: 2;
  order: 1; 
  @media(min-width: 992px) { order: 2; } 
`

const MenuTop = (props) => {
  return (
    <Wrapper>
      <HorizontalForm>
        <FilterStatuses>
          <Field name='status' component={Status} />
        </FilterStatuses>
      </HorizontalForm>
    </Wrapper>
  )
}

export default reduxForm({ form: 'exchangeForm' })(MenuTop)
