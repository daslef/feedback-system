from dataclasses import dataclass
from environs import Env


@dataclass
class Config:
    tg_token: str
    webhook_url: str
    webhook_path: str
    redis_url: str
    gateway_url: str


def load_config() -> Config:
    env = Env()
    env.read_env(".env")

    tg_token = env.str("TG_TOKEN")
    webhook_path = f"/bot/{tg_token}"
    webhook_url = env.str("WEBHOOK_URL") + webhook_path

    return Config(
        tg_token=tg_token,
        webhook_path=webhook_path,
        webhook_url=webhook_url,
        redis_url=env.str("REDIS_URL"),
        gateway_url=env.str("GATEWAY_URL"),
    )
