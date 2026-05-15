import React from 'react';
import './css/ModalLogout.css';

const ModalLogout = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="logout-overlay">
            <div className="logout-modal">
                <div className="logout-icon">🚪🐝</div>
                <h2 className="logout-title">¿Cerrar Sesión?</h2>
                <p className="logout-message">
                    Estás a punto de salir de tu sesión en Beekeeper. ¿Deseas continuar?
                </p>
                <div className="logout-actions">
                    <button className="btn-cancel" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="btn-confirm" onClick={onConfirm}>
                        Sí, salir ahora
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalLogout;