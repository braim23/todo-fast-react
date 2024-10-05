from typing import Optional

from fastapi import FastAPI
from todo.models.models import Todo, Todo_Pydantic, TodoIn_Pydantic


app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World"}