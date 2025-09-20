import os
import json
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from agent import root_agent

# ----------------------------
# Initialize FastAPI App
# ----------------------------
app = FastAPI(
    title="My Travel Saathi Agent API",
    description="AI-powered travel planning agent with hotel booking and place search capabilities",
    version="1.0.0"
)

# ----------------------------
# CORS Middleware
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Request/Response Models
# ----------------------------
class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    status: str

class AgentInfo(BaseModel):
    name: str
    description: str
    model: str
    tools_count: int

# ----------------------------
# Health Check Endpoint
# ----------------------------
@app.get("/health")
async def health_check():
    """Health check endpoint for Cloud Run"""
    return {"status": "healthy", "service": "travel_saathi_agent"}

# ----------------------------
# Agent Info Endpoint
# ----------------------------
@app.get("/info", response_model=AgentInfo)
async def agent_info():
    """Get information about the agent"""
    return AgentInfo(
        name=root_agent.name,
        description=root_agent.description,
        model=root_agent.model,
        tools_count=len(root_agent.tools) if hasattr(root_agent, 'tools') else 0
    )

# ----------------------------
# Simple Chat Endpoint
# ----------------------------
@app.post("/chat", response_model=ChatResponse)
async def chat_with_agent(message: ChatMessage):
    """Chat with the agent and get complete response"""
    try:
        # Try multiple approaches to call the agent
        
        # Approach 1: Try run_async
        try:
            response_generator = root_agent.run_async(message.message)
            full_response = ""
            async for chunk in response_generator:
                full_response += str(chunk)
            
            if full_response.strip():
                return ChatResponse(
                    response=full_response,
                    status="success"
                )
        except Exception as e1:
            print(f"run_async failed: {e1}")
        
        # Approach 2: Try run_live
        try:
            response_generator = root_agent.run_live(message.message)
            full_response = ""
            async for chunk in response_generator:
                full_response += str(chunk)
            
            if full_response.strip():
                return ChatResponse(
                    response=full_response,
                    status="success"
                )
        except Exception as e2:
            print(f"run_live failed: {e2}")
        
        # If both approaches fail, provide a helpful response
        raise Exception("All agent execution methods failed")
    
    except Exception as e:
        # Fallback to a helpful response if agent fails
        error_msg = str(e)
        if "SSL" in error_msg or "certificate" in error_msg.lower():
            fallback_response = f"Hello! I'm your Travel Saathi 🧳. I received your message: '{message.message}'. I'm currently having trouble connecting to the hotel database, but I can still help you with travel planning advice. Please try again in a moment or contact support if the issue persists."
        elif "model_copy" in error_msg:
            fallback_response = f"Hello! I'm your Travel Saathi 🧳. I received your message: '{message.message}'. I'm currently experiencing a compatibility issue with the AI model. Let me help you with travel planning advice: For hotels in Goa, I recommend checking popular areas like North Goa (Baga, Calangute) or South Goa (Palolem, Colva). You can also search for specific hotel names or budget ranges. Please try again in a moment or contact support if the issue persists."
        else:
            fallback_response = f"Hello! I'm your Travel Saathi 🧳. I received your message: '{message.message}'. I encountered an issue processing your request: {error_msg}. Please try rephrasing your question or try again later."
        
        return ChatResponse(
            response=fallback_response,
            status="partial_success"
        )

# ----------------------------
# Streaming Chat Endpoint (SSE)
# ----------------------------
@app.post("/chat/stream")
async def chat_with_agent_stream(message: ChatMessage):
    """Chat with the agent using Server-Sent Events streaming"""
    
    async def generate_stream():
        try:
            # Use the actual agent to process the message
            # The agent's run_async method returns an async generator
            response_generator = root_agent.run_async(message.message)
            
            # Stream the response in real-time
            async for chunk in response_generator:
                chunk_str = str(chunk)
                yield f"data: {json.dumps({'type': 'response', 'content': chunk_str})}\n\n"
                await asyncio.sleep(0.05)  # Small delay for better streaming experience
            
            yield f"data: {json.dumps({'type': 'end'})}\n\n"
            
        except Exception as e:
            # Fallback to a helpful response if agent fails
            error_msg = str(e)
            if "SSL" in error_msg or "certificate" in error_msg.lower():
                fallback_response = f"Hello! I'm your Travel Saathi 🧳. I received your message: '{message.message}'. I'm currently having trouble connecting to the hotel database, but I can still help you with travel planning advice. Please try again in a moment or contact support if the issue persists."
            elif "model_copy" in error_msg:
                fallback_response = f"Hello! I'm your Travel Saathi 🧳. I received your message: '{message.message}'. I'm currently experiencing a compatibility issue with the AI model. Let me help you with travel planning advice: For hotels in Goa, I recommend checking popular areas like North Goa (Baga, Calangute) or South Goa (Palolem, Colva). You can also search for specific hotel names or budget ranges. Please try again in a moment or contact support if the issue persists."
            else:
                fallback_response = f"Hello! I'm your Travel Saathi 🧳. I received your message: '{message.message}'. I encountered an issue processing your request: {error_msg}. Please try rephrasing your question or try again later."
            
            # Stream the fallback response
            words = fallback_response.split()
            for word in words:
                chunk = word + " "
                yield f"data: {json.dumps({'type': 'response', 'content': chunk})}\n\n"
                await asyncio.sleep(0.1)
            
            yield f"data: {json.dumps({'type': 'end'})}\n\n"
    
    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

# ----------------------------
# Legacy Endpoints (for backward compatibility)
# ----------------------------
@app.post("/run")
async def run_agent_legacy(message: ChatMessage):
    """Legacy endpoint - redirects to /chat"""
    return await chat_with_agent(message)

@app.post("/run_sse")
async def run_agent_sse_legacy(message: ChatMessage):
    """Legacy endpoint - redirects to /chat/stream"""
    return await chat_with_agent_stream(message)

# ----------------------------
# Root Endpoint
# ----------------------------
@app.get("/")
async def root():
    """Root endpoint with API documentation"""
    return {
        "message": "My Travel Saathi Agent API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "info": "/info",
            "chat": "/chat",
            "chat_stream": "/chat/stream",
            "docs": "/docs"
        }
    }

# ----------------------------
# Main Application Entry Point
# ----------------------------
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
