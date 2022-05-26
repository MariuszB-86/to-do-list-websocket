const express = require('express');
const app = express();
const socket = require('socket.io');

const tasks = [];

const server = app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);
  
  socket.on('addTask', ({id, name}) =>{
    tasks.push({id: id, name: name});
    socket.broadcast.emit('addTask', {id: id, name: name});
  });

  socket.on('removeTask', (taskId) => {
    const findTask = tasks.find(task => taskId === task.id);
    const taskIndex = tasks.indexOf(findTask);
    tasks.splice(taskIndex, 1);
    socket.broadcast.emit('removeTask', taskId);
  });
});