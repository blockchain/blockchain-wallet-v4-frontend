import React from 'react'
import styled from 'styled-components'

const PreferencesRow = styled.div`
  border-bottom: 1px solid #ddd;
`
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
`
const ChangeWarning = styled.p`
  color: #CA3A3C;
  font-weight: 400;
  font-size: 16px;
`
const EmailInputContainer = styled.div`
  display: flex;
`
const Cancel = styled.span`
  cursor: pointer;
`

class EmailAddress extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      renderAlert: false,
      changingEmail: false,
      email: 'blockchainuser@gmail.com'
    }

    this.renderAlert = this.renderAlert.bind(this)
    this.renderEmailOrInput = this.renderEmailOrInput.bind(this)
    this.toggleEmailInput = this.toggleEmailInput.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
  }

  renderAlert () {
    if (this.state.changingEmail) {
      return (
        <ChangeWarning>This will change your wallet's email address, but the email address you signed up to Buy Bitcoin with will remain the same.</ChangeWarning>
      )
    }
  }

  renderEmailOrInput () {
    if (this.state.changingEmail) {
      return (
        <EmailInputContainer className='align-items-start flex-column'>
          <label>Email Address</label>
          <div className='input-group'>
            <input id='email-input' className='margin-bottom-20' type='text' value={this.state.email} autoFocus />
          </div>
        </EmailInputContainer>
      )
    } else {
      return (
        <p>{this.state.email}</p>
      )
    }
  }

  toggleEmailInput () {
    this.setState({changingEmail: !this.state.changingEmail})
  }

  handleEmailChange () {
    // use magic to change the email
  }

  render () {
    return (
      <PreferencesRow className='row'>
        <RowContainer>
          <div className='col-md-6 padding-bottom-10'>
            <h6 className='em-400 type-h6'>Email Address</h6>
            <p>Your verified email address is used to send login codes when suspicious or unusual activity is detected, to remind you of your wallet login ID, and to send bitcoin payment alerts when you receive funds.</p>
            {this.renderAlert()}
          </div>
          <div className='offset-md-2 col-md-4 right-align'>
            {this.renderEmailOrInput()}
            {this.state.changingEmail ? <Cancel className='f-14 margin-right-5' onClick={() => this.toggleEmailInput()}>Cancel</Cancel> : ''}
            <a className='button-secondary' onClick={this.state.changingEmail ? () => this.handleEmailChange() : () => this.toggleEmailInput()}>Change</a>
          </div>
        </RowContainer>
      </PreferencesRow>
    )
  }
}

export default EmailAddress
