/** Client-side of groupchat. */

const urlParts = document.URL.split("/");
const roomName = urlParts[urlParts.length - 1];
const ws = new WebSocket(`ws://localhost:3000/chat/${roomName}`);


const name = prompt("Username?");


/** called when connection opens, sends join info to server. */

ws.onopen = function(evt) {
  console.log("open", evt);

  let data = {type: "join", name: name};
  ws.send(JSON.stringify(data));
};


/** called when msg received from server; displays it. */

ws.onmessage = function(evt) {
  console.log("message", evt);

  let msg = JSON.parse(evt.data);
  let item;

  if (msg.type === "note" || msg.type === 'joke' || msg.type === 'private') {
    item = $(`<li><i>${msg.text}</i></li>`);
  } else if (msg.type === "chat") {
    item = $(`<li><b>${msg.name}: </b>${msg.text}</li>`);
  } else if (msg.type === 'members') {
    item = $('<li>');
    for (let x = 0; x < msg.text.length; x++) {
      item.append(`<i>${msg.text[x]}</i> `)
    }
  } else {
    return console.error(`bad message: ${msg}`);
  }

  $('#messages').append(item);
};


/** called on error; logs it. */

ws.onerror = function (evt) {
  console.error(`err ${evt}`);
};


/** called on connection-closed; logs it. */

ws.onclose = function (evt) {
  console.log("close", evt);
};

/** send message when button pushed. */

$('form').submit(function (evt) {
  evt.preventDefault();

  let val = $("#m").val();
  let data;

  if (val === '/joke') {
    data = {type: 'joke'};
  } else if (val === '/members') {
    data = {type: 'members'};
  } else if (val.startsWith('/priv')) {
    const args = val.split(' ');
    const getText = ([x,y,...args]) => args
    data = {type: 'private', user: args[1], me: name, text: getText(args).join(' ')};
  } else {
    data = {type: "chat", text: val}
  }

  ws.send(JSON.stringify(data));

  $('#m').val('');
});

