import React from 'react'
import { findDOMNode } from 'react-dom'
import { pathOr } from 'ramda'

const fontSizeToNumber = fontSize => Number(fontSize.replace(/px/, ''))

// Empirical constant
const getFontSizeToCharWidth = fontSize => {
  if (/px/.test(fontSize)) return 0.62
  return 0
}

const calculateFontSizeRatio = (
  inputWidth,
  inputFontSize,
  fontSizeToCharWidth,
  valueLength
) => inputWidth / (inputFontSize * fontSizeToCharWidth * valueLength)

const getValueLength = value => {
  const length = String(value).length
  return /\./.test(value) ? length - 0.5 : length
}

export const ResizeableInputHOC = Component =>
  class ResizeableInput extends React.PureComponent {
    componentDidMount () {
      window.addEventListener('resize', this.resizeInputFont)
    }

    componentDidUpdate () {
      this.updateValueLength(pathOr(0, ['input', 'value'], this.props))
    }

    componentWillUnmount () {
      window.removeEventListener('resizes', this.resizeInputFont)
    }

    selectInput () {
      const ref = this.componentRef
      if (!ref) return

      const node = findDOMNode(ref)
      if (!node) return

      return node.querySelector('input')
    }

    /**
     * putting valueLength in state causes an unneccessary rerender upon setState
     * which moves caret to the end
     * although being a react anti-pattern attribute works best here
     */
    valueLength = 0

    resizeInputFont = () => {
      const input = this.selectInput()
      if (!input) return
      const fontSize = this.props.maxFontSize
      const fontSizeNumber = fontSizeToNumber(fontSize)
      let fontSizeRatio = calculateFontSizeRatio(
        input.offsetWidth,
        fontSizeNumber,
        getFontSizeToCharWidth(fontSize),
        this.valueLength
      )
      if (fontSizeRatio > 1) fontSizeRatio = 1
      input.style.fontSize = `${fontSizeNumber * fontSizeRatio}px`
    }

    updateValueLength = value => {
      const valueLength = getValueLength(value)
      if (valueLength === this.valueLength) return

      this.valueLength = valueLength
      this.resizeInputFont()
    }

    onValueChange = e => {
      this.props.input.onChange(e)
      this.updateValueLength(pathOr(0, ['target', 'value'], e))
    }

    getComponentRef = ref => {
      this.componentRef = ref
    }

    render () {
      return (
        <Component
          {...this.props}
          input={{ ...this.props.input, onChange: this.onValueChange }}
          ref={this.getComponentRef}
        />
      )
    }
  }
