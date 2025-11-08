from typing import List
from aiogram.types import KeyboardButton, InlineKeyboardButton, InlineKeyboardMarkup, ReplyKeyboardMarkup

start_button = [InlineKeyboardButton(text="Начать", callback_data="Начать")]

back_button = [InlineKeyboardButton(text="Назад", callback_data="Назад")]

restart_button = [
    InlineKeyboardButton(text="Дополнить сообщение", callback_data="Назад")
]


def _generate_inline_keyboard(values: List[str]):
    """Генерация инлайн-клавиатур"""
    return [[InlineKeyboardButton(text=value, callback_data=value)] for value in values]


def build_region_keyboard(regions: List) -> InlineKeyboardMarkup:
    """Выбор района"""
    return InlineKeyboardMarkup(inline_keyboard=_generate_inline_keyboard(regions))


def build_area_keyboard(available_areas: List[str]) -> InlineKeyboardMarkup:
    """Выбор территории"""
    return InlineKeyboardMarkup(
        inline_keyboard=_generate_inline_keyboard(available_areas) + [back_button]
    )


def build_feedback_keyboard() -> InlineKeyboardMarkup:
    """Дополнение сообщения"""
    return InlineKeyboardMarkup(inline_keyboard=[restart_button])


def build_start_keyboard() -> KeyboardButton:
    """Начало взаимодействия"""
    return ReplyKeyboardMarkup(keyboard=[[KeyboardButton(text="Начать")]], is_persistent=True, resize_keyboard=True)
