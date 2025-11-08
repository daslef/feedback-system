from aiogram import Router, F, types
from aiogram.fsm.context import FSMContext
from aiogram.filters import CommandStart
from aiogram.types import ReplyKeyboardRemove

from .router_area import router_area
from .router_feedback import router_feedback
from .router_region import router_region

from ..fsm import FormStates
from .. import provider, templates, keyboards


router = Router()
router.include_routers(
    router_feedback,
    router_area,
    router_region,
)


@router.message(CommandStart())
async def send_welcome_message(message: types.Message, state: FSMContext):
    await state.clear()
    welcome_text = templates.welcome

    await message.answer(
        welcome_text,
        reply_markup=keyboards.build_start_keyboard(),
        parse_mode="MarkdownV2",
    )


@router.message(F.text == "Начать")
async def handle_start(message: types.Message, state: FSMContext):
    await state.clear()

    regions = provider.get().keys()
    removeMarkupMessage = await message.answer("Получение данных...", reply_markup=ReplyKeyboardRemove())
    await removeMarkupMessage.delete()

    await message.answer(
        templates.prompt_to_regions,
        reply_markup=keyboards.build_region_keyboard(regions),
        parse_mode="MarkdownV2",
    )
    await state.set_state(FormStates.waiting_for_region_selection)


@router.callback_query(F.data == "Назад")
async def handle_back(callback: types.CallbackQuery, state: FSMContext):
    await callback.answer()

    regions = provider.get().keys()

    await callback.message.answer(
        text=templates.prompt_to_regions,
        reply_markup=keyboards.build_region_keyboard(regions),
        parse_mode="MarkdownV2",
    )
    await state.set_state(FormStates.waiting_for_region_selection)


@router.message(F.text.startswith("/"))
async def handle_unknown_message(message: types.Message):
    await message.answer(templates.error_unknown, parse_mode="MarkdownV2")


@router.message(~F.data, ~F.text)
async def handle_unknown_type(message: types.Message):
    await message.answer(templates.error_unknown, parse_mode="MarkdownV2")
