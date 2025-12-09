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
    method: "DELETE",
    path: "/analitics/{id}",
    handler: handler.deleteAnaliticsHandler,
  },
  {
    method: "PUT",
    path: "/analitics/{id}",
    handler: handler.updateAnaliticsHandler,
  },
];

export default routes;
