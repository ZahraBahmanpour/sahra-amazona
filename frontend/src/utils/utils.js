export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.reponse.data.message
    : error.message;
};
