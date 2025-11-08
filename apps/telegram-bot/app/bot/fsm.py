from aiogram.fsm.state import State, StatesGroup


class FormStates(StatesGroup):
    waiting_for_region_selection = State()
    waiting_for_area_selection = State()
    waiting_for_feedback = State()
