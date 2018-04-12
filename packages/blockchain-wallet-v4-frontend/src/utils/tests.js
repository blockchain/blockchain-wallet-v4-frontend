import React from 'react'

export const testPropTypes = (component, propName, arraysOfTestValues, otherProps) => {
  console.error = jest.fn()
  const _test = (testValues, expectError) => {
    for (let propValue of testValues) {
      console.error.mockClear()
      React.createElement(component, { ...otherProps, [propName]: propValue })
      expect(console.error).toHaveBeenCalledTimes(expectError ? 1 : 0)
    }
  }
  _test(arraysOfTestValues[0], false)
  _test(arraysOfTestValues[1], true)
}
