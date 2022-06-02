import React from 'react'
import { findDOMNode } from 'react-dom'

const fontSizeToNumber = (fontSize) => Number(fontSize.replace(/px/, ''))

// Empirical constant
const getFontSizeToCharWidth = (fontSize) => {
  if (/px/.test(fontSize)) return 0.65
  return 0
}

const calculateFontSizeRatio = (inputWidth, inputFontSize, fontSizeToCharWidth, valueLength) =>
  inputWidth / (inputFontSize * fontSizeToCharWidth * valueLength)

const getValueLength = (value) => {
  const { length } = String(value)
  const matchDot = /\.*/.exec(value)
  const matchOne = /1*/.exec(value)
  const matchDotLength = matchDot ? matchDot[0].length : 0
  const matchOneLength = matchOne ? matchOne[0].length : 0
  const altLength = length - matchDotLength - matchOneLength
  return altLength !== length ? altLength + matchDotLength / 2 + matchOneLength / 1.3 : length
}

/**
 * THIS HOC CAN ONLY BE USED ON CLASS COMPONENTS
 * ANY SFC WILL NOT WORK AND SFC WRAPPED WITH styled() WILL BREAK IN PROD
 */
export const ResizeableFontInput = (Component) =>
  class ResizeableInput extends React.PureComponent {
    // eslint-disable-next-line react/static-property-placement
    static defaultProps = {
      onUpdate: () => {}
    }

    state = {
      fontRatio: 1
    }

    /**
     * putting valueLength in state causes an unneccessary rerender upon setState
     * which moves caret to the end
     * although being a react anti-pattern attribute works best here
     */
    valueLength = 0

    componentRef = React.createRef()

    componentDidMount() {
      window.addEventListener('resize', this.resizeInputFont)
      requestAnimationFrame(() => {
        this.updateValueLength()
        this.resizeInputFont()
      })
    }

    componentDidUpdate() {
      requestAnimationFrame(this.updateValueLength)
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.resizeInputFont)
    }

    resizeInputFont = () => {
      const input = this.selectInput()
      if (!input) return

      // @ts-ignore
      const { maxFontSize, onUpdate } = this.props
      const fontSizeNumber = fontSizeToNumber(maxFontSize)
      const fontSizeRatio = calculateFontSizeRatio(
        input.offsetWidth,
        fontSizeNumber,
        getFontSizeToCharWidth(maxFontSize),
        this.valueLength
      )
      if (fontSizeRatio > 0) {
        this.setState({ fontRatio: fontSizeRatio > 1 ? 1 : fontSizeRatio })
      }

      input.style.fontSize = `${fontSizeNumber * this.state.fontRatio}px`
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

    onValueChange = (e) => {
      // @ts-ignore
      this.props.input.onChange(e)
      requestAnimationFrame(this.updateValueLength)
    }

    selectInput() {
      const ref = this.componentRef.current
      if (!ref) return

      // @ts-ignore
      // eslint-disable-next-line react/no-find-dom-node
      const node = findDOMNode(ref)
      if (!node) return

      // @ts-ignore
      return node.querySelector('input')
    }

    render() {
      return (
        <Component
          {...this.props}
          // @ts-ignore
          input={{ ...this.props.input, onChange: this.onValueChange }}
          ref={this.componentRef}
        />
      )
    }
  }
