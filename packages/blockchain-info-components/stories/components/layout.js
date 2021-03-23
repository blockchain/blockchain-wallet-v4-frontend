import React from 'react'
import PropTypes from 'prop-types'
import styled, { ThemeProvider } from 'styled-components'

import { FontGlobalStyles, IconGlobalStyles } from '../../src'
import { Color, Palette } from '../../src/Colors/index.ts'
import { SimpleDropdown } from '../../src/Dropdowns'

const BasePage = styled.div`
  font-family: -apple-system, '.SFNSText-Regular', 'San Francisco', Roboto,
    'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif;
  color: rgb(68, 68, 68);
  -webkit-font-smoothing: antialiased;
  font-weight: 400;
  line-height: 1.45;
  font-size: 15px;
  border: 1px solid ${Color('grey200')};
  padding: 20px 40px 40px;
  border-radius: 2px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 2px 3px;
  background-color: ${Color('white')};
  margin-top: 20px;
  margin-bottom: -30px;
`
const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid ${Color('grey200')};
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 30px;
`
const Title = styled.h1`
  margin: 0px;
  padding: 0px;
  font-size: 25px;
`
const Content = styled.div`
  position: relative;
  width: 100%;
  height: ${props => props.height};
`

class Layout extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { theme: 'defaut' }
    this.themes = [
      { text: 'Default', value: 'default' },
      { text: 'Complement', value: 'complement' },
      { text: 'Grayscale', value: 'grayscale' },
      { text: 'Invert', value: 'invert' }
    ]
    this.selectTheme = this.selectTheme.bind(this)
  }

  selectTheme(item) {
    this.setState({ theme: item.value })
  }

  render() {
    const theme = Palette(this.state.theme)

    return (
      <BasePage>
        <TitleWrapper>
          <Title>Visual</Title>
          <SimpleDropdown
            items={this.themes}
            selectedValue={this.state.theme}
            callback={this.selectTheme}
          />
        </TitleWrapper>
        <Content height={this.props.height}>
          <ThemeProvider theme={theme}>
            {this.props.children}
            <FontGlobalStyles />
            <IconGlobalStyles />
          </ThemeProvider>
        </Content>
      </BasePage>
    )
  }
}

Layout.propTypes = {
  height: PropTypes.string
}

Layout.defaultProps = {
  height: 'auto'
}

export default Layout
