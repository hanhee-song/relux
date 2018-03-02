export const fetchUser = (id) => {
  // Spoof a user and an async ajax call
  const user = {
    id,
    name: Math.random()
  };
  return new Promise(function(resolve, reject) {
    setTimeout(() => {
      resolve(user);
    }, 300);
  });
};
