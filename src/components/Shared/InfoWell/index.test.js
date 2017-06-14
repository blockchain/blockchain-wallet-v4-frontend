import React from 'react'
import renderer from 'react-test-renderer'

import InfoWell from './index.js'

test('Displays an info well', () => {
  const component = renderer.create(
    <InfoWell>Hello2</InfoWell>
  )
  expect(component.toJSON()).toMatchSnapshot()
})
