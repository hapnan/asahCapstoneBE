const routes = (handler) => [
  {
    method: "POST",
    path: "/analitics",
    handler: handler.addAnaliticsHandler,
  },
  {
    method: "GET",
    path: "/analitics",
    handler: handler.getAnaliticsHandler,
  },
  {
    method: "GET",
    path: "/analitics/user",
    handler: handler.getAnaliticsHandlerById,
  },
  {
    method: "DELETE",
    path: "/analitics/{customerId}",
    handler: handler.deleteAnaliticsHandler,
  },
  {
    method: "PUT",
    path: "/analitics/{customerId}",
    handler: handler.updateAnaliticsHandler,
  },
];

export default routes;
