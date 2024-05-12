import Widget from './Widget';

const conteiner = document.querySelector('.conteiner-posts');
const url = 'https://javascript-24-rxjs-backend2.onrender.com';
const widget = new Widget(conteiner, url);
widget.init();
