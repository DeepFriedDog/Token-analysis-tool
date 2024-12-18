from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import api
from .routes.websocket import websocket_endpoint

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add routes
app.include_router(api.router)
app.websocket("/ws/analysis")(websocket_endpoint)