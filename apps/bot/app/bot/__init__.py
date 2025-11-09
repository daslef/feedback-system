from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.redis import RedisStorage

from .handlers import router


def build_bot(config):
    bot = Bot(token=config.tg_token)
    storage = RedisStorage.from_url(config.redis_url)

    dp = Dispatcher(storage=storage)
    dp.include_router(router)

    return bot, dp
