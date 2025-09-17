import requests
from google.adk.agents import Agent
from google.adk.tools import FunctionTool  # 👈 CORRECT import path
from toolbox_core import ToolboxSyncClient

# ----------------------------
# Connect to MCP Toolbox (hotel DB, bookings, users)
# ----------------------------
toolbox = ToolboxSyncClient("http://127.0.0.1:5000")
try:
    hotel_tools = toolbox.load_toolset("trip_planner_mvp_tools")
except Exception as e:
    print("⚠️ Failed to load hotel tools:", e)
    hotel_tools = []

# ----------------------------
# Define direct HTTP tool for Places Search
# ----------------------------
def places_search_tool(query: str) -> dict:
    """Search for places (e.g., nightlife, attractions, restaurants) using Google Places API v1.
    
    Args:
        query: The search query for places (e.g., "nightlife in Mumbai", "restaurants near me")
    
    Returns:
        A dictionary containing search results with status and places data.
        Example: {'status': 'success', 'places': [...]} or {'status': 'error', 'message': '...'}
    """
    try:
        url = "http://127.0.0.1:8080/places-search"
        res = requests.post(url, json={"query": query})
        res.raise_for_status()
        return {"status": "success", "data": res.json()}
    except requests.exceptions.RequestException as e:
        return {"status": "error", "message": f"Failed to search places: {str(e)}"}

# Create FunctionTool using the correct ADK import
places_tool = FunctionTool(func=places_search_tool)

# ----------------------------
# Combine all tools
# ----------------------------
all_tools = hotel_tools + [places_tool]

# ----------------------------
# Define Agent
# ----------------------------
root_agent = Agent(
    name="trip_planner_agent",
    model="gemini-2.0-flash",  # Updated to use gemini-2.0-flash
    description="Agent that helps users register, search hotels, book trips, and find nearby attractions.",
    instruction=(
        "You are My Travel Saathi 🧳. "
        "Step 1: If user_id is not set, ask for existing or new user registration details (name, email, phone) "
        "and call the create-user tool. Store the returned user_id in memory. "
        "Step 2: If user_id exists, let the user search hotels (by name, location, or traveler type). "
        "Step 3: For bookings, always use the stored user_id. "
        "Step 4: Allow the user to review bookings using list-bookings. "
        "Step 5: If the user asks about nightlife, restaurants, or attractions, "
        "call the places_search tool with their query. "
        "Always provide helpful and accurate information."
    ),
    tools=all_tools,
)