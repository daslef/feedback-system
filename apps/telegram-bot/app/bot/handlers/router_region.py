from aiogram.fsm.context import FSMContext
from aiogram import Router, F, types

from ..fsm import FormStates
from ..keyboards import build_area_keyboard
from .. import provider, templates

router_region = Router()


@router_region.callback_query(
    FormStates.waiting_for_region_selection, F.data.in_(provider.get().keys())
)
async def handle_region_selection(callback: types.CallbackQuery, state: FSMContext):
    await callback.answer()
    selected_region = callback.data
    available_areas = provider.get().get(selected_region)

    await callback.message.answer(
        templates.prompt_to_area.format(selected_region),
        reply_markup=build_area_keyboard(available_areas),
        parse_mode="MarkdownV2",
    )

    await state.update_data(location=selected_region)
    await state.set_state(FormStates.waiting_for_area_selection)


@router_region.message(FormStates.waiting_for_region_selection)
async def handle_incorrect_region(message: types.Message):
    await message.answer(
        text=templates.error_handwritten,
        reply_markup=build_area_keyboard(provider.get().keys()),
        parse_mode="MarkdownV2",
    )
