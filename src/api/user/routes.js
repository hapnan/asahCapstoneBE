const routes = (handler) => [
  {
    method: "GET",
    path: "/user",
    handler: handler.getUserProfile,
  },
];

export default routes;
