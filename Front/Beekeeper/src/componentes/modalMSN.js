import './css/modalMSN.css';

const ModalMSN = ({ isOpen, onClose, title, message, type, goView, view, onConfirm }) => {
    if (!isOpen) return null;

    const closeModal = () => {
        if (goView && view && view !== "") {
            goView(view);
        }
        onClose(false);
    };

    return (
        <div className="modal-overlay">
            <div className={`modal-content ${type === 'error' ? 'modal-error' : ''}`}>
                <div className="modal-header">
                    <h2>{type === 'error' ? '⚠️ ' + title : '✅ ' + title}</h2>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>

                <div className="modal-footer" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '25px' }}>
                    {type === 'confirmar' ? (
                        <>
                            <button className="modal-button" onClick={onConfirm}>
                                ACEPTAR
                            </button>
                            <button 
                                className="modal-button" 
                                onClick={() => onClose(false)} 
                                style={{ 
                                    backgroundColor: '#e5e7eb', 
                                    color: '#4b5563', 
                                    border: '2px solid #4b5563', 
                                    boxShadow: '4px 4px 0px #4b5563' 
                                }}
                            >
                                CANCELAR
                            </button>
                        </>
                    ) : (
                        <button className="modal-button" onClick={() => closeModal()}>
                            ENTENDIDO
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalMSN;