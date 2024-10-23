/**
 * @param {number} n
 * @returns {number[]}
 */
function fibonacci(n) {
  if (n === 0) return [0];

  const result = fibonacci(n - 1);
  const next = n === 1 ? 1 : result[n - 1] + result[n - 2];

  result.push(next);

  return result;
}

// Jangan hapus kode di bawah ini!
export default fibonacci;
