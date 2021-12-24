// https://stackoverflow.com/a/11958496
const levenshteinDistanceSearch = (s: string, t: string): number => {
  const d: Array<Array<number>> = [] // 2d matrix

  // Step 1
  const n = s.length
  const m = t.length

  if (n === 0) return m
  if (m === 0) return n

  // Create an array of arrays in javascript (a descending loop is quicker)
  for (let i = n; i >= 0; i -= 1) d[i] = []

  // Step 2
  for (let i = n; i >= 0; i -= 1) d[i][0] = i
  for (let j = m; j >= 0; j -= 1) d[0][j] = j

  // Step 3
  for (let i = 1; i <= n; i += 1) {
    const s_i = s.charAt(i - 1)

    // Step 4
    for (let j = 1; j <= m; j += 1) {
      // Check the jagged ld total so far
      if (i === j && d[i][j] > 4) return n

      const t_j = t.charAt(j - 1)
      const cost = s_i === t_j ? 0 : 1 // Step 5

      // Calculate the minimum
      let mi = d[i - 1][j] + 1
      const b = d[i][j - 1] + 1
      const c = d[i - 1][j - 1] + cost

      if (b < mi) mi = b
      if (c < mi) mi = c

      d[i][j] = mi // Step 6

      // Damerau transposition
      if (i > 1 && j > 1 && s_i === t.charAt(j - 2) && s.charAt(i - 2) === t_j) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost)
      }
    }
  }

  // Step 7
  return d[n][m]
}

export { levenshteinDistanceSearch }
