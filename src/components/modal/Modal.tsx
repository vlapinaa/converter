import './Modal.css'

interface PropsModal {
    closeModal: (event: React.MouseEventHandler<HTMLButtonElement>) => void
}

function Modal({closeModal}: PropsModal) {
  
    return (
      <>
        <div className='modal-wrapper' onClick={closeModal}>
            <div className='modal' onClick={(e) => e.stopPropagation()}>
                <button className='modal__close' onClick={closeModal}>
                        x
                </button>
            </div>
        </div>
      </>
    )
  }
  
  export default Modal