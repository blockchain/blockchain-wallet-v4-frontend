import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { Icon } from 'blockchain-info-components'
import { TextBox, TabMenuTransactionStatus } from 'components/Form'

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
const Search = styled.div`
  position: relative;
  width: 100%;
  @media(min-width: 1200px) { width: auto; }
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
        <Status>
          <Field name='status' statuses={['', 'sent', 'received']} component={TabMenuTransactionStatus} />
        </Status>
        <Search>
          <Field name='search' component={TextBox} />
          <SearchIcon name='search' size='20px' />
        </Search>
      </Container>
    </Wrapper>
  )
}

export default reduxForm({ form: 'etherTransaction' })(Menu)
