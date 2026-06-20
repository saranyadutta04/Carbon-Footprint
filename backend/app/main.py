from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.api.v1.api_router import api_router

# 1. Rate Limiter Setup (OWASP Mitigation: API Abuse / DoS)
# Limits requests based on the client's IP address.
limiter = Limiter(key_func=get_remote_address)

# 2. Secure HTTP Headers Middleware (OWASP Mitigation: XSS, Clickjacking, Sniffing)
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        # Restrict resources to the same origin; adapt as needed for external CDNs/APIs
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        return response

app = FastAPI(title="Eco Carbon API", version="1.0.0")

# Attach the rate limiter to the application state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Inject custom security headers
app.add_middleware(SecurityHeadersMiddleware)

# 3. Restrictive CORS Setup (OWASP Mitigation: Cross-Origin Exploits)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ecocarbon.app",           # Strict Production Domain
        "https://staging.ecocarbon.app",   # Staging Environment
        "http://localhost:3000",           # Local Frontend Dev
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"], # Reject arbitrary methods like TRACE
    allow_headers=["Authorization", "Content-Type"], # Restrict allowed headers
)

# Protect the specific endpoints by adding the @limiter.limit("5/minute") decorator in the router later
app.include_router(api_router, prefix="/api/v1")
