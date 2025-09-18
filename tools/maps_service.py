#!/usr/bin/env python3
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import requests, os

app = FastAPI()
API_KEY = os.getenv("GOOGLE_MAPS_KEY")

class Location(BaseModel):
    lat: float
    lng: float

class PlacesSearchRequest(BaseModel):
    query: str
    query: str = Field(..., example="restaurants in Mountain View")

@app.post("/places-search")
def places_search(req: PlacesSearchRequest):
    if not API_KEY:
        return {"error": "GOOGLE_MAPS_KEY not set"}
        raise HTTPException(status_code=500, detail="GOOGLE_MAPS_KEY not set on the server.")

    # Using the newer Places API (v1) endpoint
    url = "https://places.googleapis.com/v1/places:searchText"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": (
            "places.displayName,places.formattedAddress,"
            "places.location,places.rating,places.types"
        )
    }
    payload = {"textQuery": req.query}
    res = requests.post(url, headers=headers, json=payload).json()

    results = []
    for place in res.get("places", []):
        results.append({
            "name": place.get("displayName", {}).get("text"),
            "rating": place.get("rating"),
            "address": place.get("formattedAddress"),
            "location": place.get("location"),
            "types": place.get("types", [])
        })

    return {"results": results}

# get the Api Key
@app.get("/debug-key")
def debug_key():
    return {
        "has_key": bool(API_KEY),
        "key_length": len(API_KEY) if API_KEY else 0
    }

# ----------------------------
# Run with python maps_service.py
# ----------------------------
if __name__ == "__main__":
    import uvicorn
    # Use the PORT environment variable provided by Cloud Run, default to 8080
    port = int(os.environ.get("PORT", 8080))
    # Listen on all network interfaces
    uvicorn.run(app, host="0.0.0.0", port=port)
