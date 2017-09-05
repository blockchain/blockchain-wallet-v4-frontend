import styled from 'styled-components'

const Form = styled.form.attrs({
  onSubmit: props => props.onSubmit
})`
  width: 100%;
  & > * { margin: 7px 0; }
`

export default Form
