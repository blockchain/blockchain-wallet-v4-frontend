import React from 'react'

/* eslint-disable */

// spy on console error
console.error = jest.fn()

export const testPropTypes = (component, propName, testValues, expectError, otherProps) => {
  const _test = (testValues) => {
    for (let propValue of testValues) {
      console.error.mockClear()
      React.createElement(component, { ...otherProps, [propName]: propValue })
    }

    let errorCount = console.error.mock.calls.length

    return (errorCount === testValues.length && expectError) && (errorCount === 0 && !expectError)
  }

  return !_test(testValues)
}
/* eslint-enable */
