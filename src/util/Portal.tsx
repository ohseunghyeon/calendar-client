import React from 'react';
import ReactDOM from 'react-dom';

const ModalPortal: React.FC = ({ children }) => {
  const el = document.getElementById('modal');
  return el ? ReactDOM.createPortal(children, el) : null;
};

export default ModalPortal;
