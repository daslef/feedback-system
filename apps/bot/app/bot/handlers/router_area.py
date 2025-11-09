from aiogram import types, Router, F
from aiogram.fsm.context import FSMContext

from ..keyboards import build_area_keyboard
from .. import provider, templates
from ..fsm import FormStates

router_area = Router()


@router_area.callback_query(
    FormStates.waiting_for_area_selection
)
async def handle_area_selection(callback: types.CallbackQuery, state: FSMContext):
    selected_area_id = callback.data

    await callback.answer()
    await callback.message.answer(
        templates.area_success.format(selected_area_id), parse_mode="MarkdownV2"
    )
    await state.update_data(voting_unit_id=selected_area_id)
    await state.set_state(FormStates.waiting_for_feedback)


@router_area.message(FormStates.waiting_for_area_selection)
async def handle_handwritten_area(message: types.Message, state: FSMContext):
    selected_region_id = await state.get_data()["selected_region_id"]
    available_areas = provider.get_areas(selected_region_id)

    await message.answer(
        text=templates.error_handwritten,
        reply_markup=build_area_keyboard(available_areas),
        parse_mode="MarkdownV2",
    )
