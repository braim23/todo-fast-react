from typing import Optional

from fastapi import FastAPI
from todo.models.models import Todo, Todo_Pydantic, TodoIn_Pydantic
from pydantic import BaseModel

from tortoise.contrib.fastapi import HTTPNotFoundError, register_tortoise


app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World"}

class Status(BaseModel):
    message: str

@app.get("/todos", response_model=list[Todo_Pydantic])
async def get_todos():
    return await Todo_Pydantic.from_queryset(Todo.all())

@app.get("/todos/{todo_id}", response_model=Todo_Pydantic, responses={404: {"model": HTTPNotFoundError}})
async def get_todo(todo_id: int):
    return await Todo_Pydantic.from_queryset_single(Todo.get(id = todo_id))


@app.post("/todos", response_model=Todo_Pydantic)
async def create_todo(todo: TodoIn_Pydantic):
    todo_obj = await Todo.create(**todo.dict(exclude_unset=True))
    return await Todo_Pydantic.from_tortoise_orm(todo_obj)




register_tortoise(
app,
db_url="postgres://postgres:1q2w3E*@localhost:5432/fastTodo",
modules={"models": ["todo.models.models"]},
generate_schemas=True,
add_exception_handlers=True,
)