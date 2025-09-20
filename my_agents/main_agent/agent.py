import os
import requests
from google.adk.agents import Agent
from google.adk.tools import FunctionTool 
from toolbox_core import ToolboxSyncClient

# ----------------------------
# Service Endpoints (Cloud Run)
# ----------------------------
TOOLBOX_URL = os.getenv("TOOLBOX_URL", "https://toolbox-345761725129.us-central1.run.app")
MAPS_SERVICE_URL = os.getenv("MAPS_SERVICE_URL", "https://maps-service-345761725129.us-central1.run.app/places-search")

# ----------------------------
# Connect to MCP Toolbox (hotel DB, bookings, users)
# ----------------------------
toolbox = ToolboxSyncClient(TOOLBOX_URL)
try:
    # Load the raw MCP tools first
    raw_hotel_tools = toolbox.load_toolset("trip_planner_mvp_tools")
    print(f"✅ Loaded {len(raw_hotel_tools)} MCP tools")
except Exception as e:
    print("⚠️ Failed to load hotel tools:", e)
    print("🔧 This is likely due to SSL certificate issues or network connectivity.")
    print("🛠️ The agent will still work with mock data for testing purposes.")
    raw_hotel_tools = []

# ----------------------------
# Debug and inspect MCP tool structure
# ----------------------------
def inspect_mcp_tools():
    """Debug function to understand MCP tool structure"""
    print("🔍 Inspecting MCP tools...")
    for i, tool in enumerate(raw_hotel_tools):
        print(f"Tool {i}:")
        print(f"  Type: {type(tool)}")
        print(f"  Dir: {[attr for attr in dir(tool) if not attr.startswith('_')]}")
        if hasattr(tool, 'name'):
            print(f"  Name: {tool.name}")
        elif hasattr(tool, 'tool_name'):
            print(f"  Tool Name: {tool.tool_name}")
        elif hasattr(tool, 'function_name'):
            print(f"  Function Name: {tool.function_name}")
        print("  ---")
        if i >= 2:  # Just inspect first few tools
            break

# Run inspection
if raw_hotel_tools:
    inspect_mcp_tools()

# ----------------------------
# Helper function to get tool name safely
# ----------------------------
def get_tool_name(tool):
    """Get tool name from MCP tool object, handling different possible attributes"""
    for attr in ['name', 'tool_name', 'function_name', '__name__']:
        if hasattr(tool, attr):
            return getattr(tool, attr)
    return None

def get_tool_function(tool):
    """Get callable function from MCP tool object"""
    for attr in ['func', 'function', 'call', '__call__']:
        if hasattr(tool, attr) and callable(getattr(tool, attr)):
            return getattr(tool, attr)
    return None

# ----------------------------
# Create a tool registry for easier lookup
# ----------------------------
tool_registry = {}
for tool in raw_hotel_tools:
    name = get_tool_name(tool)
    if name:
        tool_registry[name] = tool
        print(f"✅ Registered tool: {name}")
    else:
        print(f"⚠️ Could not determine name for tool: {type(tool)}")

print(f"📋 Tool registry: {list(tool_registry.keys())}")

# ----------------------------
# Create wrapper functions with improved error handling
# ----------------------------
def create_user_wrapper(name: str, email: str, phone: str) -> dict:
    """Create a new user account.
    
    Args:
        name: Full name of the user
        email: Email address of the user  
        phone: Phone number of the user
    
    Returns:
        Dictionary with user creation result including user_id
    """
    tool_name = "create-user"
    if tool_name not in tool_registry:
        return {"error": f"Tool '{tool_name}' not found in registry. Available: {list(tool_registry.keys())}"}
    
    tool = tool_registry[tool_name]
    func = get_tool_function(tool)
    if not func:
        return {"error": f"No callable function found for tool '{tool_name}'"}
    
    try:
        return func(name=name, email=email, phone=phone)
    except Exception as e:
        return {"error": f"Failed to create user: {str(e)}"}

def search_hotels_wrapper(query: str) -> dict:
    """Search for hotels by name, location, or traveler type.
    
    Args:
        query: Search query for hotels
    
    Returns:
        Dictionary with hotel search results
    """
    tool_name = "search-hotels"
    if tool_name not in tool_registry:
        return {"error": f"Tool '{tool_name}' not found in registry. Available: {list(tool_registry.keys())}"}
    
    tool = tool_registry[tool_name]
    func = get_tool_function(tool)
    if not func:
        return {"error": f"No callable function found for tool '{tool_name}'"}
    
    try:
        return func(query=query)
    except Exception as e:
        return {"error": f"Failed to search hotels: {str(e)}"}

def book_hotel_wrapper(user_id: str, hotel_id: str, check_in: str, check_out: str, guests: int) -> dict:
    """Book a hotel for a user.
    
    Args:
        user_id: ID of the user making the booking
        hotel_id: ID of the hotel to book
        check_in: Check-in date (YYYY-MM-DD format)
        check_out: Check-out date (YYYY-MM-DD format)
        guests: Number of guests
    
    Returns:
        Dictionary with booking result
    """
    tool_name = "book-hotel"
    if tool_name not in tool_registry:
        return {"error": f"Tool '{tool_name}' not found in registry. Available: {list(tool_registry.keys())}"}
    
    tool = tool_registry[tool_name]
    func = get_tool_function(tool)
    if not func:
        return {"error": f"No callable function found for tool '{tool_name}'"}
    
    try:
        return func(user_id=user_id, hotel_id=hotel_id, check_in=check_in, check_out=check_out, guests=guests)
    except Exception as e:
        return {"error": f"Failed to book hotel: {str(e)}"}

def list_bookings_wrapper(user_id: str) -> dict:
    """List all bookings for a user.
    
    Args:
        user_id: ID of the user
    
    Returns:
        Dictionary with user's booking list
    """
    tool_name = "list-bookings"
    if tool_name not in tool_registry:
        return {"error": f"Tool '{tool_name}' not found in registry. Available: {list(tool_registry.keys())}"}
    
    tool = tool_registry[tool_name]
    func = get_tool_function(tool)
    if not func:
        return {"error": f"No callable function found for tool '{tool_name}'"}
    
    try:
        return func(user_id=user_id)
    except Exception as e:
        return {"error": f"Failed to list bookings: {str(e)}"}

def search_hotels_by_name_wrapper(name: str) -> dict:
    """Search for hotels by name.
    
    Args:
        name: The name of the hotel
    
    Returns:
        Dictionary with hotel search results
    """
    tool_name = "search-hotels-by-name"
    if tool_name not in tool_registry:
        return {"error": f"Tool '{tool_name}' not found in registry. Available: {list(tool_registry.keys())}"}
    
    tool = tool_registry[tool_name]
    func = get_tool_function(tool)
    if not func:
        return {"error": f"No callable function found for tool '{tool_name}'"}
    
    try:
        return func(name=name)
    except Exception as e:
        return {"error": f"Failed to search hotels by name: {str(e)}"}

def search_hotels_by_location_wrapper(location: str) -> dict:
    """Search for hotels by location.
    
    Args:
        location: The location of the hotel
    
    Returns:
        Dictionary with hotel search results sorted by price
    """
    tool_name = "search-hotels-by-location"
    if tool_name not in tool_registry:
        return {"error": f"Tool '{tool_name}' not found in registry. Available: {list(tool_registry.keys())}"}
    
    tool = tool_registry[tool_name]
    func = get_tool_function(tool)
    if not func:
        return {"error": f"No callable function found for tool '{tool_name}'"}
    
    try:
        return func(location=location)
    except Exception as e:
        return {"error": f"Failed to search hotels by location: {str(e)}"}

def search_hotels_by_traveler_type_wrapper(traveler_type: str) -> dict:
    """Search for hotels by traveler type (family or couple).
    
    Args:
        traveler_type: The type of traveler ('family' or 'couple')
    
    Returns:
        Dictionary with hotel search results from BigQuery
    """
    tool_name = "search-hotels-by-traveler-type"
    if tool_name not in tool_registry:
        return {"error": f"Tool '{tool_name}' not found in registry. Available: {list(tool_registry.keys())}"}
    
    tool = tool_registry[tool_name]
    func = get_tool_function(tool)
    if not func:
        return {"error": f"No callable function found for tool '{tool_name}'"}
    
    try:
        return func(traveler_type=traveler_type)
    except Exception as e:
        return {"error": f"Failed to search hotels by traveler type: {str(e)}"}

def search_user_by_name_wrapper(name: str) -> dict:
    """Search for a user by their full name.
    
    Args:
        name: The full or partial name of the user
    
    Returns:
        Dictionary with user search results
    """
    tool_name = "search-user-by-name"
    if tool_name not in tool_registry:
        return {"error": f"Tool '{tool_name}' not found in registry. Available: {list(tool_registry.keys())}"}
    
    tool = tool_registry[tool_name]
    func = get_tool_function(tool)
    if not func:
        return {"error": f"No callable function found for tool '{tool_name}'"}
    
    try:
        return func(name=name)
    except Exception as e:
        return {"error": f"Failed to search user by name: {str(e)}"}

def search_user_by_email_wrapper(email: str) -> dict:
    """Search for a user by their email address.
    
    Args:
        email: The email of the user
    
    Returns:
        Dictionary with user search results
    """
    tool_name = "search-user-by-email"
    if tool_name not in tool_registry:
        return {"error": f"Tool '{tool_name}' not found in registry. Available: {list(tool_registry.keys())}"}
    
    tool = tool_registry[tool_name]
    func = get_tool_function(tool)
    if not func:
        return {"error": f"No callable function found for tool '{tool_name}'"}
    
    try:
        return func(email=email)
    except Exception as e:
        return {"error": f"Failed to search user by email: {str(e)}"}

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
        res = requests.post(MAPS_SERVICE_URL, json={"query": query})
        res.raise_for_status()
        return {"status": "success", "data": res.json()}
    except requests.exceptions.RequestException as e:
        return {"status": "error", "message": f"Failed to search places: {str(e)}"}

# ----------------------------
# Create FunctionTools with wrapper functions
# ----------------------------
hotel_tools = [
    FunctionTool(func=create_user_wrapper),
    FunctionTool(func=search_hotels_wrapper),  # Keep this as a general search function
    FunctionTool(func=search_hotels_by_name_wrapper),
    FunctionTool(func=search_hotels_by_location_wrapper),
    FunctionTool(func=search_hotels_by_traveler_type_wrapper),
    FunctionTool(func=book_hotel_wrapper),
    FunctionTool(func=list_bookings_wrapper),
    FunctionTool(func=search_user_by_name_wrapper),
    FunctionTool(func=search_user_by_email_wrapper),
]

places_tool = FunctionTool(func=places_search_tool)

# ----------------------------
# Combine all tools
# ----------------------------
all_tools = hotel_tools + [places_tool]

print(f"✅ Created {len(all_tools)} ADK-compatible tools")

# ----------------------------
# Define Agent
# ----------------------------
root_agent = Agent(
    name="trip_planner_agent",
    model="gemini-2.0-flash",
    description="Agent that helps users register, search hotels, book trips, and find nearby attractions.",
    instruction=(
        "You are My Travel Saathi 🧳. "
        "Step 1: For new users, use create_user_wrapper to register them (name, email, phone) and store the returned user_id. "
        "For existing users, use search_user_by_name_wrapper or search_user_by_email_wrapper to find them. "
        "Step 2: For hotel searches, you have multiple options: "
        "- search_hotels_by_name_wrapper for specific hotel names "
        "- search_hotels_by_location_wrapper for location-based searches (results sorted by price) "
        "- search_hotels_by_traveler_type_wrapper for family/couple preferences (uses BigQuery data) "
        "- search_hotels_wrapper as a general search function "
        "Step 3: For bookings, use book_hotel_wrapper with the user_id from registration/search. "
        "Step 4: Use list_bookings_wrapper to show a user's booking history with full details. "
        "Step 5: For places/attractions, use places_search_tool for restaurants, nightlife, etc. "
        "Always provide helpful information and guide users through the booking process step by step."
    ),
    tools=all_tools,
)