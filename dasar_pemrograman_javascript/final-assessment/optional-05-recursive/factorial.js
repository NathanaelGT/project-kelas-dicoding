function factorial(n) {
  if (n > 1) {
    return n * factorial(n - 1);
  }
  return n;
}

// Jangan hapus kode di bawah ini!
export default factorial;
