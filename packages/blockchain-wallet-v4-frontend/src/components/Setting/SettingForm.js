import styled from 'styled-components'

import { Form } from 'components/Form'

const SettingForm = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  @media(min-width: 992px) { align-items: flex-end; }
`

export default SettingForm
