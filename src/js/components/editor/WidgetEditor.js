import BaseWindowEditor from './BaseWindowEditor';
import postHTML from './post.html';
import commentHTML from './comment.html';

export default class WidgetEditor extends BaseWindowEditor {
  constructor(conteiner) {
    super();
    this.bindToDOM(conteiner);
  }

  drawPost(obj) {
    // Отрисовка нового поста
    const post = WidgetEditor.addTagHTML(this.container, { className: 'post' });
    post.setAttribute('id', obj.id);
    post.insertAdjacentHTML('afterbegin', postHTML);

    const avatar = post.querySelector('.title-avatar');
    avatar.setAttribute('src', obj.avatar);

    const name = post.querySelector('.title-full_name');
    name.textContent = obj.author;

    const date = post.querySelector('.title-date');
    date.textContent = obj.created;

    const img = post.querySelector('.img-text');
    img.setAttribute('src', obj.image);

    const comments = post.querySelector('.post-comments');

    for (const item of obj.comments) {
      WidgetEditor.drawComments(comments, item);
    }
  }

  static drawComments(parent, obj) {
    // Отрисовка комментария к посту
    parent.insertAdjacentHTML('beforeend', commentHTML);
    const comment = parent.children[parent.children.length - 1];

    const avatar = comment.querySelector('.comment-avatar');
    avatar.setAttribute('src', obj.avatar);

    const name = comment.querySelector('.comment-full_name');
    name.textContent = obj.author;

    const content = comment.querySelector('.content');
    content.textContent = obj.content;

    const date = comment.querySelector('.comment-date');
    date.textContent = obj.created;
  }
}
