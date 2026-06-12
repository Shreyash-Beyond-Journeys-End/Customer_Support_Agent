import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient , models
from openai import OpenAI
from app.models.qdrant import Chunk
from fastapi import HTTPException


load_dotenv()



#setup
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

openai_client = OpenAI()

qdrant_client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
    cloud_inference=True
)



collection_name = "Unanswered_query"



# Create Collection 
if not qdrant_client.collection_exists(collection_name):
    
    qdrant_client.create_collection(
        collection_name= collection_name , 
        
        vectors_config= {
            "dense" : models.VectorParams(
                size = 1536 , 
                distance= models.Distance.COSINE
            )
        } 
    )
    print(f"Collection '{collection_name}' created.")
    
    
    
    
    
    
    
    
def store_query(chunk: Chunk):
    """store transformed query in qdrant collection of unanswered query"""
    
    try:
        dense_vec = openai_client.embeddings.create(input=chunk.transform_query , model='text-embedding-3-small').data[0].embedding

        point = models.PointStruct(
            id = chunk.query_id,
            vector = {
                "dense" : dense_vec
            },
            payload={
                "text" : chunk.transform_query,
                "query_id" : chunk.query_id
            }
        )

        qdrant_client.upsert(
            collection_name=collection_name,
            points=[point]
        )
    except Exception as e:
        raise HTTPException(status_code=400 , detail=str(e))
    
    
    
    
    
    
def dense_search(query: str):
    """perform dense search and return top all unordered query greater than certain threshold"""
    

    try:
        dense_vec = openai_client.embeddings.create(input=query , model='text-embedding-3-small').data[0].embedding
        
        dense_result = qdrant_client.query_points(
            collection_name=collection_name,
            query=dense_vec,
            using="dense",
            limit=5,
            with_payload=True,
            score_threshold=0.5
        )
    
    except Exception as e:
        raise HTTPException(status_code=400 , detail=str(e))
    
    
    
    points = dense_result.points
    
    
    query_ids = [point.payload['query_id'] for point in points]
    
    
    return query_ids






def delete_chunk_by_id(query_id):
    
    """Deletes a specific query from unanswered querys using its ID."""
    
    try:
        
        qdrant_client.delete(
            collection_name=collection_name,
            points_selector=models.PointIdsList(
                points=[query_id] 
            )
        )
        
        return {"status": "success", "message": f"Deleted chunk {query_id}"}
    
    except Exception as e:
        
        raise HTTPException(status_code=400, detail=f"Deletion failed: {str(e)}")
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
