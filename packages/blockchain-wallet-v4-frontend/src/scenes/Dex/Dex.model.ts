import styled, { css } from 'styled-components'

import Form from 'components/Form/Form'
import { media } from 'services/styles'

export const FormContainerCss = css`
  box-sizing: border-box;
  width: 550px;
  margin-top: 72px;
  background-color: ${(props) => props.theme.white};
  padding: 24px;
  border-radius: 24px;
  border: 1px solid ${(props) => props.theme.grey100};

  ${media.tablet`
    width: 100%;
  `}

  ${media.mobile`
    padding: 20px;
  `}
`
export const PageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`
export const FormWrapper = styled(Form)`
  ${FormContainerCss}
`
