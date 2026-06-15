const LoadingMessage = ({ message }) => {
  return (
    <div className="status-message status-loading" role="status">
      {message}
    </div>
  )
}

export default LoadingMessage
