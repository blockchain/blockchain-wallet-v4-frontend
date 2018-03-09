import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'
import { actions, selectors } from 'data'
import { Field } from 'redux-form'
import { path } from 'ramda'
import { TextBox } from 'components/Form'
import { Text, Button, Icon, HeartbeatLoader } from 'blockchain-info-components'

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
  width: 80%;
`
const ButtonWrapper = styled.div`
  margin: 25px 0px;
`
const MixedText = styled.span`
  margin-top: 10px;
  font-size: 14px;
  color: ${props => props.error ? props.theme['error'] : 'initial'};
  a {
    cursor: pointer;
    color: ${props => props.theme['brand-secondary']};
  }
`
const MixedTermsText = styled.label`
  margin-top: 10px;
  font-size: 14px;
  color: ${props => props.error ? props.theme['error'] : 'initial'};
  a {
    cursor: pointer;
    color: ${props => props.theme['brand-secondary']};
  }
`
const AcceptTermsContainer = styled.div`
  margin: 25px 0px;
  display: flex;
  flex-direction: row;
`
const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 25px;
`
const VerifiedWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;
  padding-top: 20px;
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
    this.changeEmail = this.changeEmail.bind(this)
  }

  componentDidMount () {
    this.props.formActions.change('sfoxCreate', 'email', this.props.email)
    this.props.formActions.change('sfoxCreate', 'phone', this.props.smsNumber)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.signupError) {
      this.props.updateUI({ error: true })
      this.setState({ error: nextProps.signupError })
      this.props.setBusyOff()
    } else {
      this.props.updateUI({ error: false })
    }
  }

  acceptTerms () {
    this.setState({ acceptedTerms: !this.state.acceptedTerms })
  }

  changeEmail () {
    this.props.updateUI({ create: 'change_email' })
  }

  render () {
    const { ui } = this.props

    const handleError = (msg) => {
      if (/user is already registered/.test(msg)) {
        return <MixedText error>Sorry, this email is already registered with SFOX. <a onClick={this.changeEmail}>Change Email</a></MixedText>
      }
      return <MixedText>There has been an error creating your account. Please refresh and try again or contact support.</MixedText>
    }

    return (
      <Wrapper>
        <form>
          <InputWrapper>
            <FieldWrapper>
              <Text>
                Email Address
              </Text>
              <Field name='email' component={TextBox} validate={[required]} />
              {
                ui.error
                  ? handleError(this.state.error)
                  : null
              }
            </FieldWrapper>
            <VerifiedWrapper>
              { !this.state.error && <Icon size='26px' name='checkmark-in-circle' /> }
            </VerifiedWrapper>
          </InputWrapper>
          <InputWrapper>
            <FieldWrapper>
              <Text>
                Phone Number
              </Text>
              <Field name='phone' component={TextBox} validate={[required]} />
            </FieldWrapper>
            <VerifiedWrapper>
              <Icon size='26px' name='checkmark-in-circle' />
            </VerifiedWrapper>
          </InputWrapper>
          <AcceptTermsContainer>
            <CheckWrapper>
              <input id='terms' type='checkbox' onClick={this.acceptTerms} />
            </CheckWrapper>
            <MixedTermsText htmlFor='terms'>
              I accept Blockchain's <a>Terms of Service</a>, SFOX's <a>Terms of Service</a> and SFOX's <a>Privary Policy</a>.
            </MixedTermsText>
          </AcceptTermsContainer>
          <ButtonWrapper>
            <Button onClick={this.props.handleSignup} nature='primary' fullwidth disabled={!this.state.acceptedTerms}>
              {
                !this.props.busy
                  ? <span>Continue</span>
                  : <HeartbeatLoader height='20px' width='20px' color='white' />
              }
            </Button>
          </ButtonWrapper>
        </form>
      </Wrapper>
    )
  }
}

AcceptTerms.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  formActions: PropTypes.object,
  invalid: PropTypes.bool,
  ui: PropTypes.object,
  email: PropTypes.string.isRequired,
  smsNumber: PropTypes.string.isRequired,
  sfoxProfile: PropTypes.object,
  handleEmailInUse: PropTypes.function
}

const mapStateToProps = (state) => ({
  email: selectors.core.settings.getEmail(state).data,
  smsNumber: selectors.core.settings.getSmsNumber(state).data,
  sfoxProfile: selectors.core.data.sfox.getProfile(state),
  signupError: path(['sfoxSignup', 'signupError'], state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { smsCodeSent: false, error: false } })
)

export default enhance(AcceptTerms)
