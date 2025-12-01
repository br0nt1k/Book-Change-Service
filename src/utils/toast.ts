import iziToast from 'izitoast';

export const toast = {
  success: (message: string) => {
    iziToast.success({ title: 'OK', message, position: 'topRight', timeout: 3000 });
  },
  error: (message: string) => {
    iziToast.error({ title: 'Помилка', message, position: 'topRight' });
  },
  info: (message: string) => {
    iziToast.info({ title: 'Інфо', message, position: 'topRight' });
  },
  warning: (message: string) => {
    iziToast.warning({ title: 'Увага', message, position: 'topRight' });
  }
};

export const confirmAction = (
  message: string, 
  onConfirm: () => Promise<void> | void,
  title: string = 'Ви впевнені?'
) => {
  iziToast.question({
    timeout: 20000,
    close: false,
    overlay: true,
    displayMode: 1,
    id: 'question',
    zindex: 9999,
    title: title,
    message: message,
    position: 'center',
    buttons: [
      ['<button><b>Так</b></button>', async function (instance, toast) {
        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
        await onConfirm();
      }, true],
      ['<button>Скасувати</button>', function (instance, toast) {
        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
      }, false]
    ]
  });
};