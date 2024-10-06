import React, { useEffect, useState, useCallback } from "react";
import { Tabs, Layout, Row, Col, message } from "antd";
import "./TodoList.css";
import TodoTab from "./TodoTab";
import TodoForm from "./TodoForm";
import { createTodo, deleteTodo, loadTodos, updateTodo } from "../services/todoService";

const { TabPane } = Tabs;
const { Content } = Layout;

const TodoList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [todos, setTodos] = useState([]);
  const [activeTodos, setActiveTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]); // Initialized

  const handleFormSubmit = (todo) => {
    console.log("Todo to create", todo);
    createTodo(todo).then(() => onRefresh()); // Fixed onRefresh call
    message.success("Todo added!");
  };

  const handleRemoveTodo = (todo) => {
    deleteTodo(todo.id).then(() => onRefresh()); // Fixed onRefresh call
    message.warning("Todo removed");
  };

  const handleToggleTodoStatus = (todo) => {
    todo.completed = !todo.completed;
    updateTodo(todo).then(() => onRefresh()); // Fixed onRefresh call
    message.info("Todo status updated!");
  };

  const refresh = () => {
    loadTodos()
      .then((json) => {
        setTodos(json);
        setActiveTodos(json.filter((todo) => todo.completed === false));
        setCompletedTodos(json.filter((todo) => todo.completed === true));
      })
      .then(() => console.log("fetch completed")); // Moved console log into the proper place
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    let data = await loadTodos(); // Fixed function call
    setTodos(data);
    setActiveTodos(data.filter((todo) => todo.completed === false));
    setCompletedTodos(data.filter((todo) => todo.completed === true));
    setRefreshing(false);
    console.log("Refresh state", refreshing);
  }, [refreshing]);

  useEffect(() => {
    refresh();
  }, [onRefresh]);

  return (
    <Layout className="layout">
      <Content style={{ padding: "0 50px" }}>
        <div className="todolist">
          <Row>
            <Col span={14} offset={5}>
              <h1>Braim's To-do's</h1>
              <TodoForm onFormSubmit={handleFormSubmit} />
              <br />
              <Tabs defaultActiveKey="all">
                <TabPane tab="All" key="all">
                  <TodoTab
                    todos={todos}
                    onTodoToggle={handleToggleTodoStatus}
                    onTodoRemoval={handleRemoveTodo}
                  />
                </TabPane>
                <TabPane tab="Active" key="active">
                  <TodoTab
                    todos={activeTodos}
                    onTodoToggle={handleToggleTodoStatus}
                    onTodoRemoval={handleRemoveTodo}
                  />
                </TabPane>
                <TabPane tab="Complete" key="complete">
                  <TodoTab
                    todos={completedTodos}
                    onTodoToggle={handleToggleTodoStatus}
                    onTodoRemoval={handleRemoveTodo}
                  />
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default TodoList;
