import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
    fromServer: false,
  };

  componentDidMount(){
    this.socket = io('http://localhost:8000');
    this.socket.on('removeTask', ( id ) => {
      this.setState({fromServer: true});
      this.removeTask(id);
    });
    this.socket.on('addTask', ({id, name}) => this.addTask(id, name));
    this.socket.on('updateData', (updateTask) => this.updateData(updateTask));
  };

  updateData = (updateTask) => {
    this.setState({tasks: updateTask});
  }

  removeTask = (id) => {
    const newListOfTasks = this.state.tasks.filter(task => id !== task.id);
    this.setState({tasks: newListOfTasks});

    (!this.state.fromServer) ? this.socket.emit('removeTask', id) : this.setState({fromServer: false});

  };

  addTask = (id, taskName) => {
    this.setState({tasks: [...this.state.tasks, {id: id, name: taskName}]});
  }

  submitForm = (e) => {
    e.preventDefault();
    const id = uuidv4();
    this.addTask(id, this.state.taskName);
    this.socket.emit('addTask', {id: id, name: this.state.taskName});
    this.setState({taskName: ''});
  }

  render() {
    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map(({id, name}) =>
              <li key={id} className="task">{name} <button className="btn btn--red" onClick={() => { this.removeTask(id) } }>Remove</button></li>)}
          </ul>
    
          <form id="add-task-form" onSubmit={this.submitForm}>
            <input value={this.state.taskName} onChange={(e) => {this.setState({taskName: e.target.value})}} className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" />
            <button className="btn" type="submit">Add</button>
          </form>
    
        </section>
      </div>
    );
  };

};

export default App;