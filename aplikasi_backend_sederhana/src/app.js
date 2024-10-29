/**
 * @typedef {NonNullable<import('@hapi/hapi').ServerRoute['handler']>} Handler
 * @typedef {(path: string, handler: Handler) => App} RegisterRoute
 * @typedef {{
 *  get: RegisterRoute;
 *  post: RegisterRoute;
 *  put: RegisterRoute;
 *  delete: RegisterRoute;
 * }} App

 * @type {App}
 */
export const app = ['GET', 'POST', 'PUT', 'DELETE'].reduce((app, method) => {
  app[method.toLowerCase()] = (path, handler) => {
    app.routes.push({ method, path, handler });

    return app;
  };

  return app;
}, {});

app.routes = [];
