import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { TabMenuAddressesStatus } from 'components/Form'

const Wrapper = styled.div`
  width: 100%;
  padding: 8px 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  @media(min-width: 1200px) {
    flex-direction: row;
    justify-content: space-between;
  }
`
const Status = styled.div`
  width: 100%;
  @media(min-width: 1200px) { width: 360px; }
`

const Menu = (props) => {
  return (
    <Wrapper>
      <Container>
        <Status>
          <Field name='status' component={TabMenuAddressesStatus} />
        </Status>
      </Container>
    </Wrapper>
  )
}

export default reduxForm({ form: 'addresses' })(Menu)
