import logging
from typing import Annotated
from contextlib import asynccontextmanager

from fastapi import FastAPI, Header
from aiogram import types

from .bot import build_bot
from .config import load_config

config = load_config()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await bot.set_webhook(url=config.webhook_url, drop_pending_updates=True)
    yield
    await bot.delete_webhook()


logger = logging.getLogger(__name__)

bot, dp = build_bot(config)

app = FastAPI(lifespan=lifespan)

@app.post(f"{config.webhook_path}")
async def bot_webhook(
    update: dict,
    x_telegram_bot_api_secret_token: Annotated[str | None, Header()] = None,
) -> None | dict:
    telegram_update = types.Update(**update)
    await dp.feed_webhook_update(bot=bot, update=telegram_update)


@app.get("/health")
async def health_check():
    return {"message": "ok"}


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(filename)s:%(lineno)d #%(levelname)-8s [%(asctime)s] - %(name)s - %(message)s",
    )
