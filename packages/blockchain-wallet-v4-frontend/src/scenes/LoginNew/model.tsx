// import React from 'react'

import styled from 'styled-components'

import {
  Form
  // FormError,
  // FormGroup,
  // FormItem,
  // FormLabel,
  // PasswordBox,
  // TextBox
} from 'components/Form'
import { Wrapper } from 'components/Public'

export const LOGIN_NEW = 'loginNew'

export const removeWhitespace = string => string.replace(/\s/g, ``)

export const PublicWrapper = styled(Wrapper)`
  position: relative;
  overflow: visible;
`

export const LoginForm = styled(Form)`
  margin-top: 20px;
`
