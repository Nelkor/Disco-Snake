import { start } from './modules/engine.js';

const init = () => {
    const canvas3d = document.querySelector('#main');
    const canvas2d = document.querySelector('#aside');

    start(canvas3d, canvas2d, 10);
};

document.addEventListener('DOMContentLoaded', init);

//
