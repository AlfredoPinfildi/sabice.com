const listeners = [];

export const push = (route) => {
  const previousRoute = window.location.pathname;

  if (previousRoute.replace(/\/$/, "") === route.replace(/\/$/, "")) {
    return;
  }

  window.history.pushState(null, null, route);
  listeners.forEach((listener) =>
    listener(previousRoute.replace(/\/$/, ""), route.replace(/\/$/, ""))
  );
};

export const listen = (callback) => {
  listeners.push(callback);
};
