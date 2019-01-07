import { ipcRenderer } from 'electron';

window.addEventListener('contextmenu', (ev: MouseEvent) => {
  const target = ev.target;
  if (target instanceof HTMLAnchorElement) {
    ev.preventDefault();
    ipcRenderer.send('browser-contextmenu-anchor', target.href);
  }
});
