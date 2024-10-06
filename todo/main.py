from typing import Optional

from fastapi import FastAPI
from todo.models.models import Todo, Todo_Pydantic, TodoIn_Pydantic
from pydantic import BaseModel
from http.client import HTTPException

from tortoise.contrib.fastapi import HTTPNotFoundError, register_tortoise
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.put("/todos/{todo_id}", response_model=Todo_Pydantic, responses={404: {"model": HTTPNotFoundError}})
async def update_todo(todo_id: int, todo: TodoIn_Pydantic):
    await Todo.filter(id=todo_id).update(**todo.dict(exclude={"id"}, exclude_unset=True))
    return await Todo_Pydantic.from_queryset_single(Todo.get(id=todo_id))

@app.delete("/todos/{todo_id}", response_model=Status, responses={404: {"model":HTTPNotFoundError}})
async def delete_todo(todo_id: int):
    delete_count = await Todo.filter(id=todo_id).delete()
    if not delete_count:
        raise HTTPException(status_code=404, detail=f"Todo {todo_id} not found")
    return Status(message=f"Deleted todo {todo_id}")
    
    




register_tortoise(
app,
db_url="postgres://postgres:1q2w3E*@localhost:5432/fastTodo",
modules={"models": ["todo.models.models"]},
generate_schemas=True,
add_exception_handlers=True,
)