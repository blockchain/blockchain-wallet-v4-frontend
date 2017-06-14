import React from 'react'
import renderer from 'react-test-renderer'

import InfoWell from './index.js'

test('Displays an info well', () => {
  const component = renderer.create(
    <InfoWell>Hello</InfoWell>
  )
  expect(component.toJSON()).toMatchSnapshot()
})
