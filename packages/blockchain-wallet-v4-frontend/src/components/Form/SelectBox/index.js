import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SelectInput } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  background-color: ${props => props.theme['white']};
`
const Error = styled.label`
  position: absolute;
  top: ${props => (props.errorBottom ? '40px' : '-20px')};
  right: 0;
  display: block;
  height: 15px;
  font-size: 12px;
  font-weight: 300;
  font-family: 'Montserrat', Helvetica, sans-serif;
  color: ${props => props.theme['error']};
`

class SelectBox extends React.PureComponent {
  componentDidUpdate (prevProps) {
    if (this.props.meta.active && !prevProps.meta.active) {
      this.selectRef.focus()
    }
  }

  getSelectRef = node => {
    if (node) this.selectRef = node
  }

  onKeyPressed = evt => {
    const event = evt || window.event
    if (event.keyCode === 27) {
      event.stopPropagation()
      this.selectRef.blur()
    }
  }

  render () {
    const {
      input,
      meta,
      hideErrors,
      errorBottom,
      className,
      ...rest
    } = this.props
    const { touched, invalid, error, pristine } = meta
    const errorState = touched && invalid ? 'invalid' : 'initial'

    return (
      <Container className={className}>
        <SelectInput
          {...input}
          {...meta}
          {...rest}
          onKeyDown={this.onKeyPressed}
          getRef={this.getSelectRef}
          errorState={errorState}
        />
        {(touched || !pristine) && error && !hideErrors && (
          <Error errorBottom={errorBottom}>{error}</Error>
        )}
      </Container>
    )
  }
}

SelectBox.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object
    ])
  }).isRequired,
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      group: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.number.isRequired,
            PropTypes.object.isRequired
          ]),
          value: PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.number.isRequired,
            PropTypes.object.isRequired
          ])
        })
      )
    })
  ).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  searchEnabled: PropTypes.bool,
  opened: PropTypes.bool
}

export default SelectBox
