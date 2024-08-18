interface Props {
  closeModal: any;
  confirmFunc: any;
  description: string;
}

const ConfirmModal = (props: Props) => {
  const handleLinkFormSubmit = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    console.log(props.confirmFunc)
    if (props.confirmFunc) {
      props.confirmFunc()
      props.closeModal()
    } else {
      alert('error with confirmation modal function passing')
      props.closeModal()
    }
  }


  return (
    <div>
      <form>
        <p>{props.description}</p>
        <button onClick={props.closeModal}>[ cancel ]</button>
        <button type="submit" form="confirm-modal-form" onClick={handleLinkFormSubmit}>
          [ confirm ]
        </button>
      </form>
    </div >
  )
}

export default ConfirmModal
