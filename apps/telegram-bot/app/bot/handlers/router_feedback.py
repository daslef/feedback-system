from aiogram import types, Router, F
from aiogram.fsm.context import FSMContext

from ..fsm import FormStates
from .. import provider, templates
from ..keyboards import build_feedback_keyboard

router_feedback = Router()


@router_feedback.message(FormStates.waiting_for_feedback, F.text.len() > 1)
async def handle_feedback(message: types.Message, state: FSMContext):
    try:
        await message.answer(
            templates.feedback_success,
            reply_markup=build_feedback_keyboard(),
            parse_mode="MarkdownV2",
        )

        state_data = await state.get_data()
        provider.save(
            {
                **state_data,
                "description": message.text,
                "username": message.from_user.username or message.from_user.first_name,
            }
        )

    except Exception:
        raise
    finally:
        await state.clear()


@router_feedback.message(FormStates.waiting_for_feedback, F.text)
async def handle_incorrect_feedback(message: types.Message):
    await message.answer(templates.error_too_short, parse_mode="MarkdownV2")
