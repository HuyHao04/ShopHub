export const handleApiError = (error, fallbackMessage = 'An unexpected error occurred.') => {
  if (error.response) {
    console.error('Response Error:', error.response.data);
    return error.response.data?.detail || fallbackMessage;
  } else if (error.request) {
    console.error('Network Error:', error.request);
    return 'Network error. Please check your connection.';
  } else {
    console.error('Runtime Error:', error.message);
    return error.message || fallbackMessage;
  }
};
