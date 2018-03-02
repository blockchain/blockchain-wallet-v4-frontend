import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { FormattedMessage } from 'react-intl'
import ui from 'redux-ui'
import { actions, selectors } from 'data'
import { reduxForm, formValueSelector, Field } from 'redux-form'

import { TextBox, Form } from 'components/Form'
import { Text, Button, Icon } from 'blockchain-info-components'

import { required } from 'services/FormHelper'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  margin: 0 auto;
`
const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const ButtonWrapper = styled.div`
  margin: 25px 0px;
`
const MixedText = styled.span`
  margin-top: 10px;
  font-size: 14px;
  a {
    cursor: pointer;
    color: ${props => props.theme['brand-secondary']};
  }
`
const AcceptTermsContainer = styled.div`
  margin: 25px 0px;
  padding: 0px 15px;
  display: flex;
  flex-direction: row;
`
const InputWrapper = styled.div`

`
const VerifiedWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;
`
const CheckWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 5px;
`

class AcceptTerms extends Component {
  constructor (props) {
    super(props)
    this.state = { acceptedTerms: false }

    this.acceptTerms = this.acceptTerms.bind(this)
  }

  componentDidMount () {
    this.props.formActions.change('sfoxCreateAcceptTerms', 'email', this.props.email)
    this.props.formActions.change('sfoxCreateAcceptTerms', 'phone', this.props.smsNumber)
  }

  acceptTerms () {
    this.setState({ acceptedTerms: !this.state.acceptedTerms })
  }

  render () {
    const { ui, invalid } = this.props
    return (
      <Wrapper>
        <form>
          <InputWrapper>
            <Text>
              Email Address
            </Text>
            <FieldWrapper>
              <Field name='email' component={TextBox} validate={[required]} />
              <VerifiedWrapper>
                <Icon size='26px' name='checkmark-in-circle' />
              </VerifiedWrapper>
            </FieldWrapper>
          </InputWrapper>
          <InputWrapper>
            <Text>
              Phone Number
            </Text>
            <FieldWrapper>
              <Field name='phone' component={TextBox} validate={[required]} />
            </FieldWrapper>
            <VerifiedWrapper>
              <Icon size='26px' name='checkmark-in-circle' />
            </VerifiedWrapper>
          </InputWrapper>
          <AcceptTermsContainer>
            <CheckWrapper>
              <input type='checkbox' onClick={this.acceptTerms} />
            </CheckWrapper>
            <MixedText>
              I accept Blockchain's <a>Terms of Service</a>, SFOX's <a>Terms of Service</a> and SFOX's <a>Privary Policy</a>.
            </MixedText>
          </AcceptTermsContainer>
          <ButtonWrapper>
            <Button onClick={this.props.handleSignup} nature='primary' fullwidth disabled={!this.state.acceptedTerms}>
              Continue
            </Button>
          </ButtonWrapper>
        </form>
      </Wrapper>
    )
  }
}

AcceptTerms.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  formActions: PropTypes.obj,
  invalid: PropTypes.bool,
  ui: PropTypes.obj,
  email: PropTypes.string.isRequired,
  smsNumber: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  email: selectors.core.settings.getEmail(state).data,
  smsNumber: selectors.core.settings.getSmsNumber(state).data
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { smsCodeSent: false } })
)

export default reduxForm({ form: 'sfoxCreateAcceptTerms' })(enhance(AcceptTerms))
