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

class Status(BaseModel):
    message: str


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