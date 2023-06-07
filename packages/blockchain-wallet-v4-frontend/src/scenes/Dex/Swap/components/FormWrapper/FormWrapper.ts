import styled from 'styled-components'

import Form from 'components/Form/Form'
import { QuoteError } from 'data/types'
import { media } from 'services/styles'

export const FormWrapper = styled(Form)`
  box-sizing: border-box;
  width: 550px;
  margin-top: 72px;
  background-color: ${(props) => props.theme.white};
  padding: 24px;
  border-radius: 24px;
  border: 1px solid ${(props) => props.theme.grey100};
  min-height: 268px;

  ${media.tablet`
    width: 100%;
  `}

  ${media.mobile`
    padding: 20px;
  `}
`
