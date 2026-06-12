from pydantic import BaseModel , Field
from typing import Any

class RagChunk(BaseModel):

    content: str 
    metadata: dict[str , Any] | None = Field(default_factory=dict)
