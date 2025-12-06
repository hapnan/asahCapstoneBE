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
];

export default routes;
