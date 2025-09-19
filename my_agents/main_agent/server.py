import os
import json
import asyncio
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from agent import root_agent

# ----------------------------
# Initialize Flask App
# ----------------------------
app = Flask(__name__)
CORS(app)

# ----------------------------
# Health Check Endpoint
# ----------------------------
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for Cloud Run"""
    return jsonify({"status": "healthy", "service": "trip_planner_agent"}), 200

# ----------------------------
# Main Agent Run Endpoint (SSE)
# ----------------------------
@app.route('/run_sse', methods=['POST'])
def run_agent_sse():
    """Run the agent with Server-Sent Events streaming"""
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({"error": "Missing 'message' in request body"}), 400
        
        user_message = data['message']
        
        def generate():
            try:
                # Run the agent and stream the response
                response = asyncio.run(root_agent.run(user_message))
                
                # Send the complete response as a single event
                yield f"data: {json.dumps({'type': 'response', 'content': response})}\n\n"
                yield f"data: {json.dumps({'type': 'end'})}\n\n"
                
            except Exception as e:
                error_msg = f"Agent execution error: {str(e)}"
                yield f"data: {json.dumps({'type': 'error', 'content': error_msg})}\n\n"
                yield f"data: {json.dumps({'type': 'end'})}\n\n"
        
        return Response(
            generate(),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        )
    
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# ----------------------------
# Simple Run Endpoint (Non-streaming)
# ----------------------------
@app.route('/run', methods=['POST'])
def run_agent():
    """Run the agent and return complete response"""
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({"error": "Missing 'message' in request body"}), 400
        
        user_message = data['message']
        
        # Run the agent
        response = asyncio.run(root_agent.run(user_message))
        
        return jsonify({
            "response": response,
            "status": "success"
        }), 200
    
    except Exception as e:
        return jsonify({"error": f"Agent execution error: {str(e)}"}), 500

# ----------------------------
# Agent Info Endpoint
# ----------------------------
@app.route('/info', methods=['GET'])
def agent_info():
    """Get information about the agent"""
    return jsonify({
        "name": root_agent.name,
        "description": root_agent.description,
        "model": root_agent.model,
        "tools_count": len(root_agent.tools) if hasattr(root_agent, 'tools') else 0
    }), 200

# ----------------------------
# Error Handlers
# ----------------------------
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# ----------------------------
# Main Application Entry Point
# ----------------------------
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
