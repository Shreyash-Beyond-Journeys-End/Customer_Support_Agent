# **Assignment 1: 🤖 AI-Powered Customer Support Agent**

*Replace Tier-1 support with a context-aware agent that actually resolves issues.*

| Assignment | Category | Group Size | Marks |
| :---- | :---- | :---- | :---- |
| \#1 of 15 | RAG \+ Agents | 5 Students | 15 \+ 3 Bonus |

## **Problem Statement**

| 🎯 | Support teams spend 60–80% of their time answering the same 20 questions. The system should triage incoming requests, resolve common issues autonomously, and escalate edge cases with a complete context summary so the human agent does not need to re-read the entire thread. |
| :---- | :---- |

## **What You're Building**

| 🔨 | A multi-turn AI support agent with RAG over a product knowledge base, confidence-based escalation logic, a live chat UI, and an admin panel showing unresolved query patterns. |
| :---- | :---- |

## 

## **Core Features**

* RAG Knowledge Base – Ingest product docs, FAQs, and past resolved tickets. Use embeddings to retrieve relevant chunks before generating a response. Support PDF, markdown, and URL ingestion.

* Multi-Turn Memory – Maintain full conversation context within a session. Reference earlier messages when answering follow-up questions without the user repeating themselves.

* Confidence & Escalation – When retrieval confidence is below threshold or the query is out of scope, escalate to a human queue with a structured handoff summary including full context.

* Live Chat UI – Web-based chat interface with typing indicators, message timestamps, and a clear visual state distinguishing AI responding from connected to human agent.

* Admin Analytics Panel – Dashboard showing query volume, resolution rate, top unanswered questions, and escalation frequency by topic.

* Feedback Loop – Thumbs-up / thumbs-down on each AI response. Negative signals queue the response for knowledge base review and improvement.

## 

## **Success Metrics**

* Agent resolves at least 70% of test queries without escalation in the demo

* Escalation logic correctly identifies all out-of-scope queries in the demo test set

* Admin panel renders real data captured from the demo session

* System handles follow-up questions referencing earlier turns correctly

* Knowledge base updates reflect in agent responses within 60 seconds