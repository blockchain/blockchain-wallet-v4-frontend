import React from 'react'
import styled from 'styled-components'

import { Field, reduxForm } from 'redux-form'
import { TabMenuStatus } from 'components/Form'

const Wrapper = styled.div`
  width: 100%;
  padding: 8px 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['gray-1']};
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`
const Container = styled.div`
  width: 100%;
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
          <Field name='status' component={TabMenuStatus} statuses={['bitcoin', 'bitcoin cash']} />
        </Status>
      </Container>
    </Wrapper>
  )
}

export default reduxForm({ form: 'addresses' })(Menu)
