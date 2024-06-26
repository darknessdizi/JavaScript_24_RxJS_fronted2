import { ajax } from 'rxjs/ajax';
import {
  map, catchError, from, of, mergeMap, Observable,
} from 'rxjs';

export default class WidgetController {
  constructor(edit, url) {
    this.edit = edit;
    this.url = url;
  }

  init() {
    const stream$ = ajax.getJSON(`${this.url}/posts/latest`)
      .pipe(
        map((value) => {
          const arrayStream$ = from(value.data)
            .pipe(
              mergeMap((obj) => {
                const object = obj;
                const url = `${this.url}/posts/${obj.id}/comments/latest`;
                return WidgetController.getRequest(url, object)
                  .pipe(
                    catchError((err) => {
                      console.log('Ошибка загрузки комментариев:', err);
                      object.comments = [];
                      return of(object);
                    }),
                  );
              }),
            );

          arrayStream$.subscribe((val) => {
            this.callback(val);
          });
          return value.data;
        }),
        catchError((error) => {
          console.log('Нет соединения с сервером:', error);
          return of([]);
        }),
      );

    stream$.subscribe();
  }

  callback(obj) {
    // Callback - получены данные от сервера
    const result = obj;
    result.created = WidgetController.getNewFormatDate(obj.created);
    result.comments = result.comments.map((item) => {
      const comment = item;
      comment.created = WidgetController.getNewFormatDate(item.created);
      return comment;
    });
    this.edit.drawPost(result);
  }

  static getNewFormatDate(timestamp) {
    // Возвращает новый формат даты и времени
    const start = new Date(timestamp);
    const year = String(start.getFullYear()).slice(2);
    const month = WidgetController.getStringTime(start.getMonth() + 1);
    const date = WidgetController.getStringTime(start.getDate());
    const hours = WidgetController.getStringTime(start.getHours());
    const minutes = WidgetController.getStringTime(start.getMinutes());
    const time = `${hours}:${minutes} ${date}.${month}.${year}`;
    return time;
  }

  static getStringTime(number) {
    // Делает число двухзначным и преобразует в строку
    let seconds = String(number);
    if (seconds.length < 2) {
      seconds = `0${number}`;
    }
    return seconds;
  }

  static getRequest(url, obj) {
    // Метод для отправки fetch запросов
    const result = obj;
    return new Observable((observer) => {
      const controller = new AbortController();

      fetch(url, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((value) => {
          result.comments = value.data;
          observer.next(result);
          observer.complete();
        })
        .catch((err) => observer.error(err));

      return () => controller.abort();
    });
  }
}
