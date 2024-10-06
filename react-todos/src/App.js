import React from 'react';
import './App.css';
import { Button } from 'antd';
import TodoList from './components/TodoList';
// import 'antd/dist/antd.css'; // Correct import for Ant Design CSS

function App() {
  return (
    <div className="App">
      <TodoList />
    </div>
  );
}

export default App;
