// import React from 'react'
import Bowser from 'bowser'
import styled from 'styled-components'

import {
  // Banner,
  Button,
  // HeartbeatLoader,
  // Icon,
  // Image,
  // Link,
  // Text,
  TextGroup
} from 'blockchain-info-components'
import {
  Form,
  // FormError,
  // FormGroup,
  // FormItem,
  FormLabel
  // PasswordBox,
  // TextBox
} from 'components/Form'
import { Wrapper } from 'components/Public'

export const LOGIN_NEW = 'loginNew'

export const removeWhitespace = string => string.replace(/\s/g, ``)
const browser = Bowser.getParser(window.navigator.userAgent)
export const isSupportedBrowser = browser.satisfies({
  chrome: '>45',
  chromium: '>45',
  edge: '>16',
  firefox: '>45',
  opera: '>20',
  safari: '>8',
  vivaldi: '>2'
})

export const ActionButton = styled(Button)`
  margin-top: 15px;
`

export const PublicWrapper = styled(Wrapper)`
  position: relative;
  overflow: visible;
`

export const LoginTextGroup = styled(TextGroup)`
  line-height: 1;
  margin: 12px 0;
  text-align: center;
`
export const LoginFormLabel = styled(FormLabel)`
  margin-bottom: 8px;
`
export const CircleBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  min-width: 40px;
  background-color: ${props => props.theme.blue600};
  border-radius: 40px;
  margin: 24px 0 8px 0;
`