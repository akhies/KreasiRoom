const TOAST_TITLES = new Map([
  [
    'error',
    {
      title: 'Gagal',
      variant: 'danger'
    }
  ],
  [
    'success',
    {
      title: 'Sukses',
      variant: 'success'
    }
  ],
  [
    'info',
    {
      title: 'Informasi',
      variant: 'info'
    }
  ]
]);

const toast = (ref, text = '', status = 'success') => {
  return ref.toast(text, {
    title: TOAST_TITLES.get(status).title,
    variant: TOAST_TITLES.get(status).variant
  });
};

export default toast;
