import styled from 'styled-components'
import PropTypes from 'prop-types'

const Form = styled.form.attrs({
  onSubmit: props => props.onSubmit
})`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: ${props =>
    props.align === 'left' ? 'flex-start'
  : props.align === 'right' ? 'flex-end' : 'center'};
  width: 100%;
  & > * { margin: 7px 0; }
`

Form.propTypes = {
  align: PropTypes.oneOf(['left', 'right', 'center'])
}

Form.defaultProps = {
  align: 'left'
}

export default Form
