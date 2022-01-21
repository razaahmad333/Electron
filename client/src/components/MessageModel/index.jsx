import React from 'react';

import './style.scss';

export default function MessageModel({ message, children }) {
  return <div className="messageModel">{message ? message : children}</div>;
}
