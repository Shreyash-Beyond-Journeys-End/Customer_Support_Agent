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



collection_name = "Answered_query"



# Create Collection 
if not qdrant_client.collection_exists(collection_name):
    
    qdrant_client.create_collection(
        collection_name= collection_name , 
        
        vectors_config= {
            "dense" : models.VectorParams(
                size = 1536 , 
                distance= models.Distance.COSINE
            )
        } , 
        
        sparse_vectors_config={
            "sparse" : models.SparseVectorParams(
                modifier=models.Modifier.IDF,
                index = models.SparseIndexParams(on_disk=True)
            )
        }
        
    )
    print(f"Collection '{collection_name}' created.")
    
    
    
    
    
    
    
    
def store_query(chunk: Chunk):
    """store transformed query in qdrant collection of answered query"""
    
    
    try:
        dense_vec = openai_client.embeddings.create(input=chunk.transform_query , model='text-embedding-3-small').data[0].embedding

        point = models.PointStruct(
            id = chunk.query_id,
            vector = {
                "dense" : dense_vec , 
                "sparse" : models.Document(
                    text = chunk.transform_query,
                    model= "qdrant/bm25"
                )
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
    
    
    
    
    
    
def hybrid_search(query: str):
    """perform hybrid search and return top 5 best match's query ids"""
    
    try:
        dense_vec = openai_client.embeddings.create(input=query , model='text-embedding-3-small').data[0].embedding
        
        hybrid_result = qdrant_client.query_points(
            collection_name=collection_name,
            prefetch=[
                models.Prefetch(
                    query = dense_vec , 
                    using = "dense" , 
                    limit = 15
                ) ,

                models.Prefetch(
                    query = models.Document(text=query , model = "qdrant/bm25"),
                    using = "sparse" ,
                    limit = 15
                )
            ],
            query=models.FusionQuery(fusion = models.Fusion.RRF),
            limit=5,
            with_payload=True
        )
    
    except Exception as e:
        raise HTTPException(status_code=400 , detail=str(e))
    
    
    
    points = hybrid_result.points
    
    
    query_ids = [point.payload['query_id'] for point in points]
    
    
    return query_ids
    
    



def delete_chunk_by_id(query_id: str):
    
    """Deletes a specific query from answered querys using its ID."""
    
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
    
    
    
    
    
    
    
    
    
    
    
    
