import React from 'react'
import { findDOMNode } from 'react-dom'

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

/**
 * THIS HOC CAN ONLY BE USED ON CLASS COMPONENTS
 * ANY SFC WILL NOT WORK AND SFC WRAPPED WITH styled() WILL BREAK IN PROD
 */
export const ResizeableFontInputHOC = Component =>
  class ResizeableInput extends React.PureComponent {
    static defaultProps = {
      onUpdate: () => {}
    }

    componentDidMount () {
      window.addEventListener('resize', this.resizeInputFont)
    }

    componentDidUpdate () {
      requestAnimationFrame(this.updateValueLength)
    }

    componentWillUnmount () {
      window.removeEventListener('resizes', this.resizeInputFont)
    }

    selectInput () {
      const ref = this.componentRef.current
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

    componentRef = React.createRef()

    resizeInputFont = () => {
      const input = this.selectInput()
      if (!input) return

      const { maxFontSize, onUpdate } = this.props
      const fontSizeNumber = fontSizeToNumber(maxFontSize)
      let fontSizeRatio = calculateFontSizeRatio(
        input.offsetWidth,
        fontSizeNumber,
        getFontSizeToCharWidth(maxFontSize),
        this.valueLength
      )
      if (fontSizeRatio > 1) fontSizeRatio = 1
      input.style.fontSize = `${fontSizeNumber * fontSizeRatio}px`
      onUpdate(input, fontSizeRatio, fontSizeNumber)
    }

    updateValueLength = () => {
      const input = this.selectInput()
      if (!input) return
      const valueLength = getValueLength(input.value)
      if (valueLength === this.valueLength) return

      this.valueLength = valueLength
      this.resizeInputFont()
    }

    onValueChange = e => {
      this.props.input.onChange(e)
      requestAnimationFrame(this.updateValueLength)
    }

    render () {
      return (
        <Component
          {...this.props}
          input={{ ...this.props.input, onChange: this.onValueChange }}
          ref={this.componentRef}
        />
      )
    }
  }
