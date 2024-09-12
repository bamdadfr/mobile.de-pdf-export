import 'sass-reset';
import './popup.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import {PopupComponent} from 'src/pages/popup.component';

const root = document.getElementById('root');

if (root === null) {
  throw new Error('Could not select root element');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <PopupComponent />
  </React.StrictMode>,
);
