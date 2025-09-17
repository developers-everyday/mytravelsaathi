#!/usr/bin/env python3
from fastapi import FastAPI
from pydantic import BaseModel
import requests, os

app = FastAPI()
API_KEY = os.getenv("GOOGLE_MAPS_KEY")

class Location(BaseModel):
    lat: float
    lng: float

class PlacesSearchRequest(BaseModel):
    query: str

@app.post("/places-search")
def places_search(req: PlacesSearchRequest):
    if not API_KEY:
        return {"error": "GOOGLE_MAPS_KEY not set"}

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


