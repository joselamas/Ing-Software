import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Coloca el año actual dinámicamente

  return (
    <footer style={{ 
      textAlign: 'center', 
      padding: '15px', 
      backgroundColor: '#f8f9fa', 
      borderTop: '1px solid #e7e7e7',
      marginTop: 'auto' 
    }}>
      <p style={{ margin: '0', fontWeight: 'bold', color: '#333' }}>
        © {currentYear} Beekeeper. Todos los derechos reservados.
      </p>
      <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#666' }}>
        Desarrollado por el <strong>Equipo 1</strong>. <br/>
        Proyecto académico - Ingeniería de Sistemas, Universidad de Los Andes (ULA).
      </p>
    </footer>
  );
};

export default Footer;