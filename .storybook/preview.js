import React from 'react';
import { ThemeProvider } from 'styled-components';
import { addDecorator } from '@storybook/react';

import { Palette } from '../packages/blockchain-info-components/src/Colors/index'
import { FontGlobalStyles, IconGlobalStyles } from '../packages/blockchain-info-components/src'

const withTheme = () => (story, context) => {
  const theme1= Palette('default')
  const theme2 = Palette('darkmode')
  const theme3 = Palette('compliment')
  const theme4 = Palette('greyscale')
  const theme5 = Palette('invert')
  const theme = context.args.theme ? Palette(context.args.theme) : theme1

  return (
    <ThemeProvider theme={theme}>
      {story()}
    </ThemeProvider>
  )
}

const withIconsAndFonts = () => (story) => {
  return (
    <>
      {story()}
      <IconGlobalStyles />
      <FontGlobalStyles />
    </>
  )
}
addDecorator(withTheme())
addDecorator(withIconsAndFonts())

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
