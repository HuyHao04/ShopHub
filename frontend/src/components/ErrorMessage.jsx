const ErrorMessage = ({ title = 'Something went wrong', message }) => {
  return (
    <div className="status-message status-error" role="alert">
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  )
}

export default ErrorMessage
