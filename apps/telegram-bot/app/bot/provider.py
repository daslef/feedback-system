import httpx
from ..config import load_config

config = load_config()

GATEWAY_HEADERS = {
    "Content-Type": "application/json",
}


def get_regions():
    url = f"{config.gateway_url}/voting_regions"
    r = httpx.get(url, headers=GATEWAY_HEADERS)

    return r.json()

def get_areas(area_id):
    url = f"{config.gateway_url}/voting_units?filter=voting_region_id[eq]{area_id}"
    r = httpx.get(url, headers=GATEWAY_HEADERS)

    return r.json()

def save(payload):
    url = f"{config.gateway_url}/voting_votes"
    r = httpx.post(url, headers=GATEWAY_HEADERS, json=payload)

    return r.json()
