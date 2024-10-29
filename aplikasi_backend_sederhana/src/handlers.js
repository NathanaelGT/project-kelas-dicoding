/**
 * @callback Success
 * @param {string | Record<string, unknown>} dataOrMessage
 * @param {string | number} [messageOrCode]
 * @param {number} [code]
 * @returns {import('@hapi/hapi').ResponseObject}

 * @callback Fail
 * @param {string} message
 * @param {number} [code]
 * @returns {import('@hapi/hapi').ResponseObject}

 * @param {(
 *   response: { success: Success, fail: Fail },
 *   request: import('@hapi/hapi').Request
 * ) => import('./app.js').Handler} handler
 * @returns {import('./app.js').Handler}
 */
function handler(handler) {
  return (request, h) => {
    return handler(
      {
        success(dataOrMessage, messageOrCode, code) {
          const response = { status: 'success' };
          if (typeof dataOrMessage === 'string') {
            response.message = dataOrMessage;
          } else {
            response.data = dataOrMessage;
          }

          if (typeof messageOrCode === 'string') {
            response.message = messageOrCode;
          } else {
            code = messageOrCode;
          }

          return h.response(response).code(code ?? 200);
        },

        fail(message, code = 400) {
          return h
            .response({
              status: 'fail',
              message,
            })
            .code(code);
        },
      },
      request,
    );
  };
}
