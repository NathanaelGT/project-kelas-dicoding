/**
 * @param {string} value
 * @param {string} fieldName
 * @returns {string}
 */
export const string = (value, fieldName) => {
  if (!value) {
    const errorMessage = `Mohon isi ${fieldName}`;
    throw new Error(errorMessage);
  } else if (typeof value !== 'string') {
    throw new Error(`${fieldName} harus berupa string`);
  }

  return value;
};

/**
 * @param {number} value
 * @param {string} fieldName
 * @returns {number}
 */
export const number = (value, fieldName) => {
  if (typeof value !== 'number') {
    throw new Error(`${fieldName} harus berupa angka`);
  }

  return value;
};

/**
 * @param {boolean} value
 * @param {string} fieldName
 * @returns {boolean}
 */
export const boolean = (value, fieldName) => {
  if (typeof value !== 'boolean') {
    throw new Error(`${fieldName} harus berupa boolean`);
  }

  return value;
};

export const range = (readPage, pageCount) => {
  if (readPage < 0 || readPage > pageCount) {
    const messages = [];

    if (readPage < 0) {
      messages.push('readPage tidak boleh kurang dari 1');
    }
    if (readPage > pageCount) {
      messages.push('readPage tidak boleh lebih besar dari pageCount');
    }

    throw new Error(messages.join(' dan '));
  }
};
