import React from 'react'
import { Field, Form } from 'redux-form'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import TextBox from 'components/Form/TextBox'
import { required, validEmail } from 'services/forms'
import { removeWhitespace } from 'services/forms/normalizers'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.exchangeLogin};

  .header {
    height: 10%;
    width: 100%;
  }

  .content {
    height: 60%;
    width: 100%;
  }

  .footer {
    height: 10%;
    width: 100%;
  }
`

// const Footer = styled.div`
//   width: 100%;
// `

const Password = () => {
  return (
    <Wrapper>
      <div className='header'>Header</div>
      <div className='content'>
        <Text size='20px' color='white' weight={600}>
          Enter your password
          {/* <FormattedMessage */}
          {/*  id='qwe' */}
          {/*  defaultMessage='Enter your password' */}
          {/* /> */}
        </Text>
        <Form
          // onSubmit={() => console.log('submit')}
        >
          <Field
            component={TextBox}
            data-e2e='exchangeEmail'
            disableSpellcheck
            name='exchangeEmail'
            normalize={removeWhitespace}
            validate={[required, validEmail]}
            placeholder='Enter Email'
            autoFocus
          />
        </Form>
      </div>
      <div className='footer'>Footer</div>
      {/* <div> */}
      {/*  <div className='content'> */}
      {/*    <Text */}
      {/*      size='24px' */}
      {/*      style={{ marginBottom: '24px', marginTop: '48px' }} */}
      {/*      color='white' */}
      {/*      weight={600} */}
      {/*    > */}
      {/*      <FormattedMessage */}
      {/*        id='modals.wallet.tour.wallet.tour' */}
      {/*        defaultMessage='Welcome to Blockchain!' */}
      {/*      /> */}
      {/*    </Text> */}
      {/*    <Text color='grey600' size='14px' weight={500}> */}
      {/*      <FormattedMessage */}
      {/*        id='extension.blockchainDescription' */}
      {/*        defaultMessage='The easy way to send, receive, store and trade digital currencies.' */}
      {/*      /> */}
      {/*    </Text> */}
      {/*  </div> */}
      {/*  <Footer> */}
      {/*    <Button */}
      {/*      capitalize */}
      {/*      data-e2e='installAndroidAppBtn' */}
      {/*      fullwidth */}
      {/*      style={{ justifySelf: 'flex-end' }} */}
      {/*      height='48px' */}
      {/*      nature='secondary' */}
      {/*      onClick={() => console.log('Click')} */}
      {/*      size='16px' */}
      {/*    > */}
      {/*      Log In */}
      {/*    </Button> */}
      {/*  </Footer> */}
      {/* </div> */}
    </Wrapper>
  )
}

export default Password
