import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'

import { Image, Link, Text, TextGroup } from 'blockchain-info-components'
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
  display: flex;
  justify-content: flex-start;

  @media(max-width: 992px) { justify-content: center; }
`

const ShapeshiftContainer = styled(TextGroup)`
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  align-items: center;
  width: 170px;

  @media(max-width: 992px) { display: none; }
`

const ShapeshiftLogo = styled(Image)`
  display: flex;
  
`

const MenuTop = (props) => {
  return (
    <Wrapper>
      <HorizontalForm>
        <FilterStatuses>
          <Field name='status' component={Status} />
        </FilterStatuses>
        <ShapeshiftContainer>
          <Text size='12px' weight={300}>
            <FormattedMessage id='scenes.exchange.menutop.poweredby' defaultMessage='Powered by' />
          </Text>
          <Link href='https://www.shapeshift.io' target='_blank'>
            <ShapeshiftLogo name='shapeshiftLogo' width='60px' height='25px' />
          </Link>
        </ShapeshiftContainer>
      </HorizontalForm>
    </Wrapper>
  )
}

export default reduxForm({ form: 'exchangeForm' })(MenuTop)
