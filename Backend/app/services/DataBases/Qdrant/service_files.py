import os , uuid
from dotenv import load_dotenv
from qdrant_client import QdrantClient , models
from openai import OpenAI
from fastapi import HTTPException
from app.models.chunking import RagChunk


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



collection_name = "Service_files"



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
    
    
    
    
    
    
    
def store_query(chunks: list[RagChunk]):
    """store all chunks of a file into qdrant in safe batches"""
    
    if not chunks:
        return

    batch_size = 64  
    
    try:
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i + batch_size]
            texts_to_embed = [chunk.content for chunk in batch]
            
            
            embedding_response = openai_client.embeddings.create(
                input=texts_to_embed, 
                model='text-embedding-3-small'
            )
            dense_vectors = [data.embedding for data in embedding_response.data]
            
            
            points = []
            for j, chunk in enumerate(batch):
                point = models.PointStruct(
                    id=str(uuid.uuid4()),
                    vector={
                        "dense": dense_vectors[j],
                        "sparse": models.Document(
                            text=chunk.content,
                            model="qdrant/bm25"
                        )
                    },
                    payload={
                        "text": chunk.content,
                        "metadata": chunk.metadata
                    }
                )
                points.append(point)
                
            
            qdrant_client.upsert(
                collection_name=collection_name,
                points=points
            )
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
chunk_format = """
<chunk>
    <content>
        {chunk_content}
    </content>
    <metadata>
        {metadata}
    </metadata>    
</chunk>
"""  
    
    
def hybrid_search(query: str):
    """perform hybrid search and return top 5 best match's chunks"""
    
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
    
    
    results = "\n".join([chunk_format.format(chunk_content=point.payload['text'],metadata=point.payload['metadata']) for point in points])
    
    return results
    
    




    
    
    
    
    
    
    
    
    
    
    
    
