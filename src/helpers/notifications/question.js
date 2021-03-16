const requestQuestionNotification = (fcmToken, roomId) => {
  let xhr = new XMLHttpRequest();
  xhr.open(
    'POST',
    `https://iid.googleapis.com/iid/v1/${fcmToken}/rel/topics/questions_${roomId}`
  );
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader(
    'Authorization',
    `key=AAAA4C0PQso:APA91bFiQk5wd70J1eOZa6KFQjPinJlLjfYdXk7aYXFVYzOR2VUEKfHPEMON0PiFUSRByCnoq-9QKHwFgrGHQYVhaZGCuhWpfGZLBzhn7_8fGYc4-8Z-XAURR5q3napgpSx5XC5yvgP_`
  );
  xhr.send();
  return xhr;
};

export default requestQuestionNotification;
