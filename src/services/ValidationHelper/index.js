
function isNumeric (input) {
  return (input - 0) === input && ('' + input).trim().length > 0
}

export {
  isNumeric
}
