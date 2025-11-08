from aiogram import types, Router, F
from aiogram.fsm.context import FSMContext

from ..keyboards import build_area_keyboard
from .. import provider, templates
from ..fsm import FormStates

router_area = Router()


@router_area.callback_query(
    FormStates.waiting_for_area_selection, ~F.data.in_(provider.get().keys())
)
async def handle_area_selection(callback: types.CallbackQuery, state: FSMContext):
    await callback.answer()
    selected_area = callback.data

    await callback.message.answer(
        templates.area_success.format(selected_area), parse_mode="MarkdownV2"
    )
    await state.update_data(subLocation=selected_area)
    await state.set_state(FormStates.waiting_for_feedback)


@router_area.message(FormStates.waiting_for_area_selection)
async def handle_handwritten_area(message: types.Message, state: FSMContext):
    selected_region = await state.get_data()["location"]
    available_areas = provider.get().get(selected_region)

    await message.answer(
        text=templates.error_handwritten,
        reply_markup=build_area_keyboard(available_areas),
        parse_mode="MarkdownV2",
    )
