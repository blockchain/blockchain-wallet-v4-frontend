import * as template from './template.js'

it(`strips spaces out of the guid field`, () => {
  expect(
    template.removeWhitespace(`2a507510-a7a2-437c-87e3-d9191a1a0603 `)
  ).toEqual(`2a507510-a7a2-437c-87e3-d9191a1a0603`)
})
