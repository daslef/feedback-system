import httpx
from hishel import CacheOptions, SpecificationPolicy
from hishel.httpx import SyncCacheClient
from ..config import load_config

config = load_config()

GATEWAY_HEADERS = {
    "Content-Type": "application/json",
}

httpx_client = SyncCacheClient(
    policy=SpecificationPolicy(
        cache_options=CacheOptions(
            shared=True,
            supported_methods=["GET", "HEAD"],
        )
    ),
    headers=[("cache-control", "max-age=600")]
)

def get_regions():
    url = f"{config.gateway_url}/voting_regions"
    r = httpx_client.get(url, headers=GATEWAY_HEADERS)

    return r.json()

def get_areas(area_id):
    url = f"{config.gateway_url}/voting_units?filter=voting_region_id[eq]{area_id}"
    r = httpx_client.get(url, headers=GATEWAY_HEADERS)

    return r.json()

def save(payload):
    url = f"{config.gateway_url}/voting_votes"
    r = httpx.post(url, headers=GATEWAY_HEADERS, json=payload)

    return r.json()
