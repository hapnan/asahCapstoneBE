const routes = (handler) => [
  {
    method: "GET",
    path: "/customers",
    handler: handler.getAllCustomers.bind(handler),
  },
  {
    method: "GET",
    path: "/customers/{id}",
    handler: handler.getCustomerById.bind(handler),
  },
  {
    method: "GET",
    path: "/customers/predict",
    handler: handler.getAllCustomerForPredict.bind(handler),
  },
];

export default routes;
