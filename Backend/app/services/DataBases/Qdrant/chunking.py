from langchain_text_splitters import MarkdownHeaderTextSplitter , RecursiveCharacterTextSplitter
import tiktoken 
from app.models.chunking import RagChunk



tokenizer = tiktoken.get_encoding(encoding_name='cl100k_base')


def getChunks(mdContent: str , max_token: int ) -> list[RagChunk]:

    final_chunks = []



    header_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on= [
            ('#' , 'Title'),
            ('##' , 'Section'),
            ('###' , 'Subsection')
        ],
        strip_headers=False
    )


    recursive_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        encoding_name='cl100k_base',
        chunk_size=max_token,
        chunk_overlap=50
    )

    splits = header_splitter.split_text(mdContent)


    for split in splits:

        token_count = len(tokenizer.encode(split.page_content))
        content = split.page_content



        if ('|' in content and '---' in content) or token_count <= max_token:

            final_chunks.append(
                RagChunk(content= content , metadata = split.metadata)
            )

        else:

            smaller_splits = recursive_splitter.create_documents([content])


            for smaller_split in smaller_splits:

                final_chunks.append(
                    RagChunk(content= smaller_split.page_content , metadata = split.metadata)
                )


    return final_chunks