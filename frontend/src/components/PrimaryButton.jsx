const PrimaryButton = ({ label, href = '#', className = '', onClick }) => {
  const buttonClass = ['primary-button', className].filter(Boolean).join(' ')

  if (href) {
    return (
      <a className={buttonClass} href={href} onClick={onClick}>
        {label}
      </a>
    )
  }

  return (
    <button className={buttonClass} type="button" onClick={onClick}>
      {label}
    </button>
  )
}

export default PrimaryButton
