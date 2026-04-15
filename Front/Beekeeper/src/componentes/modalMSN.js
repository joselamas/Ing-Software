import React from 'react';
import './css/modalMSN.css';

const ModalMSN = ({ isOpen, onClose, title, message, type, onConfirm, goView, view }) => {
    if (!isOpen) return null;

    const handleClose = () => {
        onClose(false);
        if (goView && view) {
            goView(view);
        }
    };

    return (
        <div className="modal-msn-overlay">
            <div className="modal-msn-content">
                <h2 className="modal-msn-title" style={{ color: type === 'error' ? 'var(--danger-dark)' : 'inherit' }}>
                    {type === 'confirm' ? '⚠️ ' : ''}{title}
                </h2>
                <p className="modal-msn-message" style={{ marginBottom: '30px', fontWeight: '600', color: 'var(--muted-brown)' }}>
                    {message}
                </p>
                
                <div className="button-group" style={{ justifyContent: 'center' }}>
                    {type === 'confirm' ? (
                        <>
                            <button className="secondary-btn" onClick={() => onClose(false)}>
                                CANCELAR
                            </button>
                            <button className="primary-btn" onClick={onConfirm}>
                                CONFIRMAR
                            </button>
                        </>
                    ) : (
                        <button className="primary-btn" onClick={handleClose} style={{ minWidth: '150px' }}>
                            ENTENDIDO
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalMSN;