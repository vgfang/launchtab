import '../stylesheets/Modal.css'

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
        <h2 className="modal-title">
          ❓Confirm
        </h2>
        <p>{props.description}</p>

        <div className="modal-button-container">
          <button type="submit" form="confirm-modal-form" onClick={handleLinkFormSubmit}>
            [ confirm ]
          </button>
          <button onClick={props.closeModal}>[ cancel ]</button>
        </div>

      </form>
    </div >
  )
}

export default ConfirmModal
