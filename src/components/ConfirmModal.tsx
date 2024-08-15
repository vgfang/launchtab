interface Props {
  closeModal: any;
  confirmFunc: any;
  description: string;
}

const ConfirmModal = (props: Props) => {

  console.log(props.confirmFunc)

  const handleLinkFormSubmit = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    if (props.confirmFunc) {
      props.confirmFunc()
    }
  }


  return (
    <>
      <form>
        <p>{props.description}</p>
        <button onClick={props.closeModal}>[ cancel ]</button>
        <button type="submit" form="confirm-modal-form" onClick={handleLinkFormSubmit}>
          [ confirm ]
        </button>
      </form>
    </>
  )
}

export default ConfirmModal
