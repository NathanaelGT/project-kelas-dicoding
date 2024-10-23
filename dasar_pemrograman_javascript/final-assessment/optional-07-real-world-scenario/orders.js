/**
 * Gunakan fungsi di bawah ini untuk menghasilkan id yang unik
 *
 * @returns {string}
 */
function generateUniqueId() {
  return `_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * @typedef {Object} Item
 * @property {string} name
 * @property {number} price
 */

/**
 * @typedef {'Menunggu' | 'Diproses' | 'Selesai'} Status
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} customerName
 * @property {Item[]} items
 * @property {number} totalPrice
 * @property {Status} status
 */

/**
 * @type {Order[]}
 */
const orders = [];

/**
 * @param {string} customerName
 * @param {Item[]} items
 */
function addOrder(customerName, items) {
  orders.push({
    id: generateUniqueId(),
    customerName,
    items,
    totalPrice: items.reduce((totalPrice, item) => totalPrice + item.price, 0),
    status: 'Menunggu',
  });
}

/**
 * @param {string} orderId
 * @param {Status} status
 */
function updateOrderStatus(orderId, status) {
  const order = orders.find(order => order.id === orderId);
  if (order) {
    order.status = status;
  }
}

/**
 * @returns {number}
 */
function calculateTotalRevenue() {
  return orders.reduce((totalRevenue, order) => {
    return totalRevenue + Number(order.status === 'Selesai') * order.totalPrice;
  }, 0);
}

/**
 * @param {string} id
 */
function deleteOrder(id) {
  orders.splice(
    orders.findIndex(order => order.id === id),
    1,
  );
}

export { orders, addOrder, updateOrderStatus, calculateTotalRevenue, deleteOrder };
