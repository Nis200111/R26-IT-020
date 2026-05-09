# Bio-Heritage AI: Intent-Aware Re-Ranked RAG Framework for Sri Lankan Medicinal Herb Knowledge Retrieval

## Research Problem

Sri Lankan indigenous medicinal herb knowledge is currently scattered across books, websites, research papers, and traditional sources. Although several existing Sri Lankan Ayurvedic AI systems focus on plant identification using images, there is limited support for text-based herb knowledge retrieval. Users who already know a herb name or disease condition still cannot easily ask questions about medicinal uses, dosage, contraindications, compounds, or properties.

General Large Language Models can answer herb-related questions, but they may hallucinate unsupported medical information because they generate responses from model memory. This is a serious issue in a medically related domain where incorrect dosage or contraindication information may cause harm.

This project addresses the problem by developing a source-grounded Retrieval-Augmented Generation framework that retrieves verified Sri Lankan medicinal herb records before generating an answer. The system also includes trained lightweight machine learning models for query intent classification and herb relevance re-ranking.

---

## Models Used

- **Sentence Transformer Embedding Model**
  - `all-MiniLM-L6-v2`
  - Used to convert herb records and user queries into vector embeddings.

- **FAISS Vector Index**
  - Used for fast semantic retrieval of the most relevant herb records.

- **SVM Intent Classifier**
  - A trained machine learning model used to classify user queries into four Ayurvedic query intents:
    - `herb-disease`
    - `herb-property`
    - `dosage`
    - `contraindication`

- **Herb Relevance Re-Ranker**
  - A trained lightweight relevance model used to re-rank FAISS-retrieved herb records before sending them to the LLM.

- **Llama 3.2 via Ollama**
  - Used as the local answer generation model.
  - The LLM is not fine-tuned. It generates answers only using retrieved herb context.

---

## Methodology

1. **Dataset Preparation**
   - A structured Sri Lankan medicinal herb dataset was prepared in CSV format.
   - The dataset includes herb names, Sinhala names, Latin names, family, synonyms, treatment uses, parts used, dosage, contraindications, compounds, native distribution, conservation status, edible parts, medical properties, source details, verification status, and notes.
   - Missing values were filled using `Available soon`.
   - Duplicate records were removed during preprocessing.

2. **Herb Text Chunk Creation**
   - Each herb record was converted into a structured text chunk.
   - These chunks combine important fields such as herb name, treatment use, dosage, contraindications, compounds, and source information.
   - The generated chunks are saved as:
     - `herb_chunks.json`

3. **Embedding Generation and FAISS Indexing**
   - Each herb text chunk is embedded using the `all-MiniLM-L6-v2` sentence-transformer model.
   - The generated 384-dimensional embeddings are stored in a FAISS `IndexFlatL2` vector index.
   - The FAISS index is saved locally for fast retrieval.
   - Output files:
     - `sl_herb_faiss.index`
     - `herb_metadata.pkl`

4. **Query Intent Classification**
   - A labelled query dataset is created for four Ayurvedic query intents:
     - herb-disease
     - herb-property
     - dosage
     - contraindication
   - A TF-IDF + Linear SVM model is trained to classify incoming user questions.
   - The trained model helps the system understand the user’s information need before retrieval and answer generation.
   - Output file:
     - `intent_classifier.pkl`

5. **Herb Relevance Re-Ranking**
   - FAISS first retrieves the top candidate herb records.
   - A trained herb relevance re-ranker then reorders the retrieved records based on query-herb relevance.
   - This improves the quality of context given to the LLM and reduces the risk of hallucinated answers.

6. **RAG Answer Generation**
   - The final top-ranked herb records are passed as context to Llama 3.2 through Ollama.
   - The prompt instructs the model to answer only from the retrieved context.
   - If the required information is not available in the dataset, the system returns a message saying that verified information is not available.

7. **API and Interface Development**
   - The backend is implemented using FastAPI microservices.
   - The system contains separate services for:
     - RAG service
     - Intent classifier service
     - Explainability service
     - API gateway
   - A Streamlit interface is used for demonstration.

---

## System Architecture

```text
User Query
   ↓
SVM Intent Classifier
   ↓
FAISS Vector Retrieval
   ↓
Herb Relevance Re-Ranker
   ↓
Top-5 Verified Herb Records
   ↓
Llama 3.2 via Ollama
   ↓
Grounded Answer + Sources + Intent + Safety Note