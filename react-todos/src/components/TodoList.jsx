import React, { useEffect, useState, useCallback } from "react";
import { Tabs, Layout, Row, Col, message } from "antd";
import "./TodoList.css";
import TodoTab from "./TodoTab";
import TodoForm from "./TodoForm";
import { createTodo, deleteTodo, loadTodos, updateTodo } from "../services/todoService";

const { Content } = Layout;

const TodoList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [todos, setTodos] = useState([]);
  const [activeTodos, setActiveTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);

  const handleFormSubmit = (todo) => {
    console.log("Todo to create", todo);
    createTodo(todo).then(() => onRefresh());
    message.success("Todo added!");
  };

  const handleRemoveTodo = (todo) => {
    deleteTodo(todo.id).then(() => onRefresh());
    message.warning("Todo removed");
  };

  const handleToggleTodoStatus = (todo) => {
    todo.completed = !todo.completed;
    updateTodo(todo).then(() => onRefresh());
    message.info("Todo status updated!");
  };

  const refresh = () => {
    loadTodos()
      .then((json) => {
        setTodos(json);
        setActiveTodos(json.filter((todo) => !todo.completed));
        setCompletedTodos(json.filter((todo) => todo.completed));
      })
      .then(() => console.log("fetch completed"));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    let data = await loadTodos();
    setTodos(data);
    setActiveTodos(data.filter((todo) => !todo.completed));
    setCompletedTodos(data.filter((todo) => todo.completed));
    setRefreshing(false);
    console.log("Refresh state", refreshing);
  }, [refreshing]);

  useEffect(() => {
    refresh();
  }, [onRefresh]);

  // Define tabs items using the new Ant Design structure
  const tabsItems = [
    { label: "All", key: "all", children: (
      <TodoTab
        todos={todos}
        onTodoToggle={handleToggleTodoStatus}
        onTodoRemoval={handleRemoveTodo}
      />
    )},
    { label: "Active", key: "active", children: (
      <TodoTab
        todos={activeTodos}
        onTodoToggle={handleToggleTodoStatus}
        onTodoRemoval={handleRemoveTodo}
      />
    )},
    { label: "Complete", key: "complete", children: (
      <TodoTab
        todos={completedTodos}
        onTodoToggle={handleToggleTodoStatus}
        onTodoRemoval={handleRemoveTodo}
      />
    )}
  ];

  return (
    <Layout className="layout">
      <Content style={{ padding: "0 50px" }}>
        <div className="todolist">
          <Row>
            <Col span={14} offset={5}>
              <h1>Braim's To-do's</h1>
              <TodoForm onFormSubmit={handleFormSubmit} />
              <br />
              <Tabs defaultActiveKey="all" items={tabsItems} />
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default TodoList;
