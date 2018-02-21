import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { TextBox } from 'components/Form'
import { Text } from 'blockchain-info-components'
import { required, normalizeSocialSecurity, normalizeDateOfBirth } from 'services/FormHelper'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`
const ColLeft = styled.div`
  width: 40%;
`
const ColRight = styled.div`
  width: 60%;
`
const ColLeftInner = styled.div`
  width: 80%;
`
const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 20px;
`
const Subtitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 15px;
`
const Info = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
`
const FormRow = Row.extend`
  margin-bottom: 15px;
`
const FieldContainer = styled.div`
  width: 33%;
  padding: 0px 15px;
  display: flex;
  flex-direction: column;
`

const Verify = (props) => {
  const { handleSubmit } = props

  return (
    <Row>
      <ColLeft>
        <ColLeftInner>
          <Title>
            <FormattedMessage id='sfoxexchangedata.verify.title' defaultMessage='Verify Identity' />
          </Title>
          <Subtitle>
            <FormattedMessage id='sfoxexchangedata.verify.subtitle' defaultMessage='Setup your profile' />
          </Subtitle>
          <Info>
            <FormattedMessage id='sfoxexchangedata.verify.info' defaultMessage='To verify your identity we need to collect some personal information.' />
          </Info>
          <Info>
            <FormattedMessage id='sfoxexchangedata.verify.info2' defaultMessage='This information will be sent directly to SFOX and will not be saved to your Blockchain wallet. Any information provided is secure and safe.' />
          </Info>
        </ColLeftInner>
      </ColLeft>
      <ColRight>
        <form onSubmit={handleSubmit}>
          <FormRow>
            <FieldContainer>
              <Text size='13px'>
                <FormattedMessage id='sfoxexchangedata.verify.firstname' defaultMessage='First Name' />
              </Text>
              <Field name='firstName' validate={[required]} component={TextBox} />
            </FieldContainer>
            <FieldContainer>
              <Text size='13px'>
                <FormattedMessage id='sfoxexchangedata.verify.middlename' defaultMessage='Middle Name' />
              </Text>
              <Field name='middleName' component={TextBox} />
            </FieldContainer>
            <FieldContainer>
              <Text size='13px'>
                <FormattedMessage id='sfoxexchangedata.verify.lastname' defaultMessage='Last Name' />
              </Text>
              <Field name='lastName' validate={[required]} component={TextBox} />
            </FieldContainer>
          </FormRow>
          <FormRow>
            <FieldContainer>
              <Text size='13px'>
                <FormattedMessage id='sfoxexchangedata.verify.ssn' defaultMessage='Social Security Number' />
              </Text>
              <Field name='ssn' validate={[required]} component={TextBox} placeholder='___-__-___' normalize={normalizeSocialSecurity} />
            </FieldContainer>
            <FieldContainer>
              <Text size='13px'>
                <FormattedMessage id='sfoxexchangedata.verify.dateofbirth' defaultMessage='Date of Birth' />
              </Text>
              <Field name='dob' component={TextBox} placeholder='mm/dd/yyyy' normalize={normalizeDateOfBirth} />
            </FieldContainer>
            <FieldContainer />
          </FormRow>
        </form>
      </ColRight>
    </Row>
  )
}

export default reduxForm({ form: 'settingPasswordHint' })(Verify)
