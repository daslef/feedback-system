from aiogram import types, Router, F
from aiogram.fsm.context import FSMContext

from ..keyboards import build_area_keyboard
from .. import provider, templates
from ..fsm import FormStates

router_area = Router()


@router_area.callback_query(FormStates.waiting_for_area_selection, F.data == "Назад")
async def handle_back(callback: types.CallbackQuery, state: FSMContext):
    await callback.answer()
    await callback.message.delete()

    await state.set_state(FormStates.waiting_for_region_selection)


@router_area.callback_query(FormStates.waiting_for_area_selection)
async def handle_area_selection(callback: types.CallbackQuery, state: FSMContext):
    await callback.answer()

    state_data = await state.get_data()
    available_areas_ids = [str(area["id"]) for area in state_data.get("available_areas")]
    selected_area_id = callback.data

    if selected_area_id not in available_areas_ids:
        await callback.message.answer(templates.error_handwritten, parse_mode="MarkdownV2")
        return

    await callback.message.answer(
        templates.area_success.format(selected_area_id), parse_mode="MarkdownV2"
    )
    await state.update_data(voting_unit_id=selected_area_id)
    await state.set_state(FormStates.waiting_for_feedback)


@router_area.message(FormStates.waiting_for_area_selection)
async def handle_handwritten_area(message: types.Message):
    await message.answer(templates.error_handwritten, parse_mode="MarkdownV2")
