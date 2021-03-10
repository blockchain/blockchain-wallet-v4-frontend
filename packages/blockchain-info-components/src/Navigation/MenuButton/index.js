import React, { PureComponent } from 'react'
import styled from 'styled-components'

const ButtonContainer = styled.button`
  appearance: none;
  background: none;
  border: none;
  display: block;
  float: right;
  height: 1rem;
  padding: 0;
  position: relative;
  transform: rotate(0deg);
  transition: transform 500ms ease;
  width: 1.5rem;
  outline: none;

  > span {
    background-color: ${props => (props.color ? props.color : 'white')};
    border-radius: var(--smBorderRadius);
    display: block;
    height: 2px;
    position: relative;
    right: 0;
    top: 0;
    left: 0;
  }

  > span::before,
  > span::after {
    background-color: ${props => (props.color ? props.color : 'white')};
    border-radius: var(--smBorderRadius);
    content: '';
    display: block;
    height: 2px;
    left: 0;
    position: absolute;
    width: 100%;
    transition-duration: 200ms, 250ms;
    transition-delay: 250ms, 0s;
  }

  > span::before {
    top: -6px;
    transition-property: top, transform;
  }

  > span::after {
    bottom: -6px;
    transition-property: bottom, transform;
  }

  &.is-active {
    transform: rotate(180deg);
    transition-delay: 100ms;
  }

  &.is-active > span {
    background: none;
  }

  &.is-active > span::before,
  &.is-active > span::after {
    transition-delay: 0s, 250ms;
    background-color: white;
  }

  &.is-active > span::before {
    top: 0;
    transform: rotate(45deg);
  }

  &.is-active > span::after {
    bottom: 0;
    transform: rotate(-45deg);
  }
`

class MenuButton extends PureComponent {
  state = {
    active: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let active = prevState.active
    if (nextProps.hasOwnProperty('active')) {
      active = nextProps.active
    }
    return { active }
  }

  handleClick = () => {
    let nextActive = !this.state.active
    this.setState({ active: nextActive })
    if (this.props.callback) {
      this.props.callback(nextActive)
    }
  }

  render() {
    let classes = this.state.active ? 'is-active' : ''
    return (
      <ButtonContainer
        color={this.props.color}
        className={classes}
        onClick={this.handleClick}
      >
        <span />
      </ButtonContainer>
    )
  }
}

export default MenuButton
