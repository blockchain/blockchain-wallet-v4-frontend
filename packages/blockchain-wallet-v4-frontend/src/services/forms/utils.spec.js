import { isNumeric } from './index'

const testCases = [
  { input: '', output: false },
  { input: '?', output: false },
  { input: [1, 2], output: false },
  { input: {}, output: false },
  { input: 1, output: true },
  { input: 1.235, output: true }
]

testCases.forEach(function(testCase) {
  test('Validates a number', () => {
    expect(isNumeric(testCase.input)).toBe(testCase.output)
  })
})
