import React, { useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { getEmail, getEmailVerified } from '@core/redux/settings/selectors'
import { actions } from 'data'
import { media } from 'services/styles'

import EmailReminder from './template.email'

const Wrapper = styled.div`
  display: flex;
  padding: 8px 20px 8px 20px;
  align-items: center;
  justify-content: space-between;
  background: ${(props) => props.theme.blue600};
  overflow: hidden;
  ${media.tablet`
    display: none;
  `};
`

const StaticAnnouncementsContainer = () => {
  const [emailReminded, setEmailReminded] = useState(false)

  const { data: emailVerified } = useSelector(getEmailVerified, shallowEqual)
  const { data: email } = useSelector(getEmail, shallowEqual)

  const dispatch = useDispatch()

  const onEmailResend = () => {
    if (emailReminded) return
    dispatch(actions.modules.securityCenter.resendVerifyEmail(email, 'BANNER'))
    setEmailReminded(true)
    setTimeout(() => {
      setEmailReminded(false)
    }, 3000)
  }

  if (emailVerified) return null

  return (
    <Wrapper>
      <EmailReminder onEmailResend={onEmailResend} email={email} emailReminded={emailReminded} />
    </Wrapper>
  )
}

export default StaticAnnouncementsContainer
