import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { Icon } from 'blockchain-info-components'
import { SelectBoxAddresses, TextBox } from 'components/Form'
import TransactionMenuStatus from 'components/TransactionMenuStatus'

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

  @media(min-width: 992px) {
    flex-direction: row;
    justify-content: space-between;
  }
`
const Filter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  width: 100%;
  flex-grow: 1;

  & input { border: 1px solid ${props => props.theme['gray-2']}!important; }
  & button { border: 1px solid ${props => props.theme['gray-2']}!important; }

  @media(min-width: 992px) {
    justify-content: flex-start;
    width: 30%;
  }
`
const SearchIcon = styled(Icon)`
  position: absolute;
  top: 10px;
  right: 10px;
`

const Menu = (props) => {
  return (
    <Wrapper>
      <Container>
        <Filter>
          <Field name='source' component={SelectBoxAddresses} />
        </Filter>
        <Filter>
          <Field name='status' component={TransactionMenuStatus} />
        </Filter>
        <Filter>
          <Field name='search' component={TextBox} />
          <SearchIcon name='search' />
        </Filter>
      </Container>
    </Wrapper>
  )
}

export default reduxForm({ form: 'bitcoinTransaction' })(Menu)
