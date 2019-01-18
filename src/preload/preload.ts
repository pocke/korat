// It injects this file to BrowserView.

import { ipcRenderer } from 'electron';

window.addEventListener('contextmenu', (ev: MouseEvent) => {
  let el = ev.target;
  while (el) {
    if (el instanceof HTMLAnchorElement) {
      ev.preventDefault();
      ipcRenderer.send('browser-contextmenu-anchor', el.href);
    }

    el = (el as Node).parentNode;
  }
});
