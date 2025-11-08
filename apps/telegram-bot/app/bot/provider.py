import httpx
from ..config import load_config

config = load_config()

GATEWAY_HEADERS = {
    "Authorization": f"Bearer {config.gateway_bearer}",
    "Content-Type": "application/json",
}


def get():
    url = f"{config.gateway_url}/read"
    r = httpx.get(url, headers=GATEWAY_HEADERS)

    return r.json()


def save(payload):
    url = f"{config.gateway_url}/save"
    r = httpx.post(url, headers=GATEWAY_HEADERS, json=payload)

    return r.json()
