import './css/modalMSN.css';

const ModalMSN = ({ isOpen, onClose, title, message, type , goView , view}) => {
    if (!isOpen) return null;

    const closeModal = () => {
    // Validación: Solo ejecuta goView si AMBAS propiedades existen y son válidas
        if (goView && view && view !== "") {
            goView(view); 
        }
       onClose(false);
    };

    return (
        <div className="modal-overlay">
            <div className={`modal-content ${type === 'error' ? 'modal-error' : ''}`}>
                <div className="modal-header">
                    <h2>   {type === 'error' ? '⚠️ ' + title : '✅' + title}</h2>
                 
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <button className="modal-button" onClick={() =>closeModal()}>
                    Entendido
                </button>
            </div>
        </div>
    );
};

export default ModalMSN