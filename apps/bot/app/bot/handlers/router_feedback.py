import datetime
from aiogram import types, Router, F
from aiogram.fsm.context import FSMContext

from ..fsm import FormStates
from .. import provider, templates
from ..keyboards import build_feedback_keyboard

router_feedback = Router()


@router_feedback.message(FormStates.waiting_for_feedback, F.text.len() > 1)
async def handle_feedback(message: types.Message, state: FSMContext):
    try:
        removeMarkupMessage = await message.answer("Отправляем данные...", reply_markup=types.ReplyKeyboardRemove())

        state_data = await state.get_data()

        tz = datetime.timezone(datetime.timedelta(hours=0), name="Europe/Moscow")

        provider.save(
            {
                "voting_unit_id": int(state_data["voting_unit_id"]),
                "description": message.text,
                "username": message.from_user.username or message.from_user.first_name,
                "created_at": datetime.datetime.now(tz=tz).isoformat()
            }
        )

        await removeMarkupMessage.delete()

        await message.answer(
            templates.feedback_success,
            reply_markup=build_feedback_keyboard(),
            parse_mode="MarkdownV2",
        )

    except Exception:
        raise
    finally:
        await state.clear()


@router_feedback.message(FormStates.waiting_for_feedback, F.text)
async def handle_incorrect_feedback(message: types.Message):
    await message.answer(templates.error_too_short, parse_mode="MarkdownV2")
