function inArray(val, arr) {
    return arr.indexOf(val) !== -1
}


const inputErrorClass = 'input-error';

function setErrorInput(input) {
    input.classList.add(inputErrorClass);

    if (input.dataset.selectize) {
        const selectizeInput = input.parentElement.querySelector('.selectize-input')
        selectizeInput.classList.add(inputErrorClass);
    }
}

function unsetErrorInput(input) {
    input.classList.remove(inputErrorClass);

    if (input.dataset.selectize) {
        const selectizeInput = input.parentElement.querySelector('.selectize-input')
        selectizeInput.classList.remove(inputErrorClass);
    }
}

function focusInputInit() {
    document.querySelectorAll('input, textarea').forEach(element => element.addEventListener('focus', function () {
        unsetErrorInput(this);
    }))
}

function resetCheckboxError(input) {
    const name = input.getAttribute('name');

    const checkboxes = querySelectorAll(`input[type='radio'][name='${name}'], input[type='checkbox'][name='${name}']`)
    if (!checkboxes.length) return;

    checkboxes.forEach(function (i, item) {
        unsetErrorInput(item);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    focusInputInit();
});


function validateTextInput(input) {
    if (!input.value || !input.value.length) {
        setErrorInput(input);
        return false;
    }

    return true;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function replaceEmail(email) {
    return email.replaceAll('—', '-');
}

function validateLatin(val) {
    const regexp = /[а-яё]/i;
    if (!regexp.test(val)) return true;
    return false;
}

function validateEmailInput(input) {
    input.value = replaceEmail(input.value);

    if (!validateLatin(val)) {
        setErrorInput(input);
        return false;
    }

    if (!validateEmail(val)) {
        setErrorInput(input);
        return false;
    }

    return true;
}

function validateTel(tel) {
    var re =
        /^\+7 [0-9]{3} [0-9]{3}\-[0-9]{2}\-[0-9]{2}$/;
    return re.test(String(tel).toLowerCase());
}

function validateTelInput(input) {
    if (!validateTel(input.value)) {
        setErrorInput(input);
        return false;
    }

    return true;
}

function validateCheckboxInput(input) {
    const name = input.getAttribute('name');

    let result = false;

    const inputList = document.querySelectorAll(`input[name='${name}']`);
    inputList.forEach(function (i, item) {
        if (item.checked) result = true;
    });

    if (!result) {
        inputList.forEach(function (i, item) {
            setErrorInput(item);
        });
        return false;
    }

    return true;
}

function validateInput(input) {
    const type = input.getAttribute('type');

    if (inArray(type, ['text', 'number'])) {
        return validateTextInput(input);
    } else if (type == 'tel') {
        return validateTelInput(input);
    } else if (type == 'email') {
        return validateEmailInput(input);
    } else if (inArray(type, ['radio', 'checkbox'])) {
        return validateCheckboxInput(input);
    }
    return false;
}

function validateSelect(select) {
    if (!select.value || select.value === '-') {
        setErrorInput(select);
        return false;
    }

    return true;
}

function validateField(input) {
    const required = input.getAttribute('required');
    if (!required) return true;

    const tag = input[0].tagName.toLowerCase();
    if (tag === 'select') {
        return validateSelect(input);
    } else {
        return validateInput(input);
    }

    return false;
}

function validateFieldList(list) {
    let result = true;

    list.each(function (i, item) {
        const validate = validateField(item);
        result = result && validate;
    });

    return result;
}


function getItemData(input) {
    return input.value
}

function getItemParam(input) {
    return input.getAttribute('name');
}

function prepareFormData(list) {
    const data = {};

    list.each(function (i, item) {
        const prop = getItemParam(item);
        const val = getItemData(item);
        if (val) data[prop] = val;
    });

    return data;
}


function addVoteFormSend(form) {
    const inputList = form.querySelectorAll('input, select');
    const validate = validateFieldList(inputList);
    if (!validate) return;

    fetch('/udata/content/addVote.json',
        {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: prepareFormData(inputList)
        }).then(d => {
            form.querySelector('.msg').textContent = JSON.stringify(d);
        }).catch(error => {
            console.error(error);
        });
}

function addVoteFormInit() {
    const form = document.querySelector('.addVoteForm');

    form.on('submit', function (e) {
        e.preventDefault();
        addVoteFormSend(form);
    });
}



function reload(duration = 0) {
    if (duration) {
        setTimeout(function () {
            window.location.reload();
        }, duration)
    } else {
        window.location.reload();
    }
}

function redirect(url, delay = 0) {
    if (url === 'self') {
        reload(delay);
        return;
    }

    if (!delay) {
        window.location.href = url
        return;
    }

    setTimeout(function () {
        window.location.href = url
    }, delay);
}

function ajaxRedirect(data, delay = 1500) {
    if (!data.hasOwnProperty('redirect')) return;

    redirect(data.redirect, delay);
}

// Vote process start
const processInputSelector = '[data-item="voteProcessInput"]';

const lensSelector = '[data-icon="lens"]';

function initLensIcon() {
    lensSelector.addEventListener("click", function (event) {
        const img = event.target.parentElement.querySelector('img');
        const clickEvent = new Event('click')
        clickEvent.dispatch(img);
    })
}


Fancybox.bind("[data-fancybox]", {
    groupAttr: false
});


const checkOtherSelector = '[data-check="otherText"]';
const blockOtherSelector = '[data-block="otherText"]';

function otherCheckChange(input) {
    const blockSel = input.dataset.blocksel;
    if (!blockSel) return false;

    const block = document.querySelector('[data-blocksel="' + blockSel + '"]');
    if (input.checked) {
        block.classList.add('v');
    } else {
        block.classList.remove('v');
    }
}

function initOtherCheck() {
    document.body.querySelector('change', checkOtherSelector, function () {
        otherCheckChange(this);
    });

    checkOtherSelector.forEach(function (i, item) {
        otherCheckChange(item);
    });
}

// Vote process end


const voteAcceptBtnSelector = '[data-btn="voteAccept"]';
const voteProcessFormSelector = '[data-form="voteProcess"]';

const voteProcessIdInputSelector = '[data-field="voteId"]';

const questBlockSelector = '[data-block="questBlock"]';

const objectRadioSelector = '[data-field="objectId"]';
const objectAnswerCheckSelector = '[data-field="objectAnswer"]';
const objectOtherCheckSelector = '[data-field="objectOtherCheck"]';
const objectOtherTextSelector = '[data-field="objectOtherText"]';

const openVoteAcceptModalSelector = '[data-btn="openVoteAcceptModal"]';
const voteAcceptModalSelector = '[data-modal="voteAcceptModal"]';
const acceptModalFormMessage = '[data-block="acceptModalMessage"]';

const questAnswerField = '[data-field="answerId"]';
const questAnswerOtherCheckField = '[data-field="answerOtherCheck"]';
const questAnswerOtherTextField = '[data-field="answerOtherText"]';


function sendAnswerDraft(voteId, questId, answerId, action) {
    const data = {
        type: 'quest',
        voteId: voteId,
        questId: questId,
        answerId: answerId,
        action: action,
    };

    $.ajax({
        url: '/udata/content/saveUserDraftVote.json',
        type: 'POST',
        dataType: 'json',
        data: data
    }).done(function (d) {
        //console.log('done', d)

    }).fail(function (f) {
        //console.log('fail', f);

    });
}

function questAnswerChange(field) {
    field = $(field);

    const voteId = getVoteProcessId();
    if (!voteId) return false;

    const block = field.parents(questBlockSelector);
    if (!block.length) return false;

    const questId = block.data('questid');
    if (!questId) return false;

    const answerId = field.data('value')
    if (!answerId) return false;

    const checked = field.prop('checked');
    const action = checked ? 'set' : 'unset';

    sendAnswerDraft(voteId, questId, answerId, action);
}

function initAnswerDraft() {
    const fields = $(questAnswerField);
    fields.on('change', function () {
        const field = $(this);

        const type = field.prop('type');
        if (type === 'radio') {
            const block = field.parents(questBlockSelector);
            if (!block.length) return false;

            const fields = block.find(questAnswerField);
            fields.each(function (i, item) {
                questAnswerChange(item);
            });
        } else {
            questAnswerChange(field);
        }
    })
}


function sendAnswerOtherTextDraft(voteId, questId, text, action) {
    const data = {
        type: 'questOtherText',
        voteId: voteId,
        questId: questId,
        text: text,
        action: action,
    };

    $.ajax({
        url: '/udata/content/saveUserDraftVote.json',
        type: 'POST',
        dataType: 'json',
        data: data
    }).done(function (d) {
        //console.log('done', d)

    }).fail(function (f) {
        //console.log('fail', f);

    });
}

function initAnswerOtherTextDraft() {
    const fields = $(questAnswerOtherTextField);
    fields.on('blur', function () {
        const field = $(this);

        const voteId = getVoteProcessId();
        if (!voteId) return false;

        const block = field.parents(questBlockSelector);
        if (!block.length) return false;

        const questId = block.data('questid');
        if (!questId) return false;

        const otherCheck = block.find(questAnswerOtherCheckField);
        if (!otherCheck) return false;

        const checked = otherCheck.prop('checked');

        const text = field.val();
        const action = checked ? 'set' : 'unset';

        sendAnswerOtherTextDraft(voteId, questId, text, action);
    })

    const checkField = $(questAnswerOtherCheckField);
    checkField.on('change', function () {
        const field = $(this);

        const voteId = getVoteProcessId();
        if (!voteId) return false;

        const block = field.parents(questBlockSelector);
        if (!block.length) return false;

        const questId = block.data('questid');
        if (!questId) return false;

        const textField = block.find(questAnswerOtherTextField);
        if (!textField.length) return false;

        const text = textField.val();
        const action = field.prop('checked') ? 'set' : 'unset';

        sendAnswerOtherTextDraft(voteId, questId, text, action);
    });
}


function sendObjectDraft(voteId, objectId, action) {
    const data = {
        type: 'object',
        voteId: voteId,
        objectId: objectId,
        action: action,
    };

    $.ajax({
        url: '/udata/content/saveUserDraftVote.json',
        type: 'POST',
        dataType: 'json',
        data: data
    }).done(function (d) {
        //console.log('done', d)
    }).fail(function (f) {
        //console.log('fail', f);
    });
}

function initObjectDraft() {
    const fields = $(objectRadioSelector);
    fields.on('change', function () {
        const field = $(this);

        const voteId = getVoteProcessId();
        if (!voteId) return false;

        const objectId = field.data('value')
        if (!objectId) return false;

        const checked = field.prop('checked');
        const action = checked ? 'set' : 'unset';

        sendObjectDraft(voteId, objectId, action);
    })
}


function sendObjectAnswerDraft(voteId, answerId, action) {
    const data = {
        type: 'objectAnswer',
        voteId: voteId,
        answerId: answerId,
        action: action,
    };

    $.ajax({
        url: '/udata/content/saveUserDraftVote.json',
        type: 'POST',
        dataType: 'json',
        data: data
    }).done(function (d) {
        //console.log('done', d)

    }).fail(function (f) {
        //console.log('fail', f);

    });
}

function initObjectAnswerDraft() {
    const fields = $(objectAnswerCheckSelector);
    fields.on('change', function () {
        const field = $(this);

        const voteId = getVoteProcessId();
        if (!voteId) return false;

        const answerId = field.data('value')
        if (!answerId) return false;

        const checked = field.prop('checked');
        const action = checked ? 'set' : 'unset';

        sendObjectAnswerDraft(voteId, answerId, action);
    })
}


function sendObjectAnswerOtherTextDraft(voteId, text, action) {
    const data = {
        type: 'objectOtherText',
        voteId: voteId,
        text: text,
        action: action,
    };

    $.ajax({
        url: '/udata/content/saveUserDraftVote.json',
        type: 'POST',
        dataType: 'json',
        data: data
    }).done(function (d) {
        //console.log('done', d)

    }).fail(function (f) {
        //console.log('fail', f);

    });
}

function initObjectAnswerOtherTextDraft() {
    const fields = $(objectOtherTextSelector);
    fields.on('blur', function () {
        const field = $(this);

        const voteId = getVoteProcessId();
        if (!voteId) return false;

        const otherCheck = $(objectOtherCheckSelector);
        if (!otherCheck.length) return false;

        const text = field.val();
        const action = otherCheck.prop('checked') ? 'set' : 'unset';

        sendObjectAnswerOtherTextDraft(voteId, text, action);
    })

    const checkField = $(objectOtherCheckSelector);
    checkField.on('change', function () {
        const field = $(this);

        const voteId = getVoteProcessId();
        if (!voteId) return false;

        const textField = $(objectOtherTextSelector);
        if (!textField.length) return false;

        const text = textField.val();
        const action = field.prop('checked') ? 'set' : 'unset';

        sendObjectAnswerOtherTextDraft(voteId, text, action);
    });
}


function getVoteProcessId() {
    const input = $(voteProcessIdInputSelector);
    if (!input.length) return false;
    return input.val();
}

function getQuestData(block) {
    block = $(block);

    const questId = block.data('questid');

    const answerFields = block.find(questAnswerField);
    const answers = [];

    answerFields.each(function (i, item) {
        item = $(item);
        if (!item.prop('checked')) return true;

        val = item.data('value');

        answers.push({
            'id': val
        });
    });


    const otherCheck = block.find(questAnswerOtherCheckField);
    let otherText = '';

    if (otherCheck.length && otherCheck.prop('checked')) {
        const otherTextField = block.find(questAnswerOtherTextField);
        otherText = otherTextField.val();
    }


    const data = {
        id: questId,
    };

    if (answers.length) data.answers = answers;
    if (otherText.length) data.otherText = otherText;

    return data;
}

function getSelectedQuestAnswers() {
    const questBlock = $(questBlockSelector);
    const quests = [];

    questBlock.each(function (i, item) {
        const questData = getQuestData(item);
        if (!questData.hasOwnProperty('answers') && !questData.hasOwnProperty('otherText')) return false;

        quests.push(questData);
    });

    return {
        quests: quests,
        total: questBlock.length
    }
}

function getSelectedObjects() {
    const objectRadio = $(objectRadioSelector);
    const objects = [];

    objectRadio.each(function (i, item) {
        item = $(item);
        if (!item.prop('checked')) return true;

        val = item.data('value');

        objects.push({
            'id': val
        });
    });

    return {
        objects: objects,
        total: objectRadio.length
    }
}

function getSelectedObjectAnswers() {
    const objectAnswerRadio = $(objectAnswerCheckSelector);
    const objectAnswers = [];
    objectAnswerRadio.each(function (i, item) {
        item = $(item);
        if (!item.prop('checked')) return true;

        val = item.data('value');

        objectAnswers.push({
            'id': val
        });
    });

    return objectAnswers;
}

function getVoteObjectText() {
    const otherCheckField = $(objectOtherCheckSelector);
    if (!otherCheckField.prop('checked')) return null;

    const otherTextField = $(objectOtherTextSelector)
    const otherText = otherTextField.val();
    return otherText;
}


function validateVoteProcess(form) {
    const msgBlock = form.find(formMessageBlock);
    msgBlock.text('').removeClass('fail success');


    const questData = getSelectedQuestAnswers();
    if (questData.total && questData.quests.length !== questData.total) {
        msgBlock.text('Не заполнены ответы на некоторые вопросы').addClass('fail');
        return false;
    }


    const objectData = getSelectedObjects();
    if (objectData.total && !objectData.objects.length) {
        msgBlock.text('Не выбрана территория').addClass('fail');
        return false;
    }


    if (objectData.total) {
        const objectAnswers = getSelectedObjectAnswers();
        const objectText = getVoteObjectText();

        if (!objectAnswers.length && !objectText) {
            msgBlock.text('Не выбрано функциональное наполнение').addClass('fail');
            return false;
        }
    }

    return true;
}


function trySendVote(data, done = null, fail = null) {
    $.ajax({
        url: '/udata/content/saveUserVote.json',
        type: 'POST',
        dataType: 'json',
        data: data
    }).done(function (d) {
        //console.log('done', d)

        if (d.status === 'ok') {
            if (done) done();
        } else {
            if (fail) fail();
        }
    }).fail(function (f) {
        //console.log('fail', f);
        if (fail) fail();
    });
}


const sendVoteTryLimit = 10;
let currentSendVoteTry = 0;

function runSendVoteTry(data, done = null, fail = null) {
    //console.log('runSendVoteTry', currentSendVoteTry, sendVoteTryLimit);

    if (currentSendVoteTry > sendVoteTryLimit) {
        currentSendVoteTry = 1;
        hideBlockScreen();
        if (fail) fail();
        return false;
    }


    currentSendVoteTry++;

    trySendVote(data, done, function () {
        setTimeout(function () {
            runSendVoteTry(data, done, fail);
        }, 5000);
    });
}


function sendVoteProcess(form) {
    form = $(form);

    const msgBlock = $(acceptModalFormMessage);
    msgBlock.text('').removeClass('fail success');


    const data = {};

    const voteId = getVoteProcessId();
    data.voteId = voteId;


    const questData = getSelectedQuestAnswers();
    if (questData.total && questData.quests.length !== questData.total) {
        msgBlock.text('Не заполнены ответы на некоторые вопросы').addClass('fail');
        return false;
    }
    data.quests = questData.quests;


    const objectData = getSelectedObjects();
    if (objectData.total && !objectData.objects.length) {
        msgBlock.text('Не выбрана территория').addClass('fail');
        return false;
    }
    data.objects = objectData.objects;


    if (objectData.total) {
        const objectAnswers = getSelectedObjectAnswers();
        const objectText = getVoteObjectText();

        if (!objectAnswers.length && !objectText) {
            msgBlock.text('Не выбрано функциональное наполнение').addClass('fail');
            return false;
        }

        if (objectAnswers.length) data.objectAnswers = objectAnswers;
        if (objectText) data.objectText = objectText;
    }


    showBlockScreen();
    runSendVoteTry(
        data,
        function () {
            msgBlock.text('Данные сохранены').addClass('success');

            const url = window.location.origin + window.location.pathname;
            redirect(url, 1500);
        },
        function () {
            msgBlock.text('Произошла ошибка, пожалуйста попробуйте отправить еще раз').addClass('fail');
        }
    );
}

function initVoteOpenModalBtn() {
    const btn = $(openVoteAcceptModalSelector);
    const form = $(voteProcessFormSelector);

    btn.click(function () {
        const validate = validateVoteProcess(form);
        if (!validate) return false;

        const modal = $(voteAcceptModalSelector).modal('show');
    });
}

function initVoteProcessBtn() {
    const btn = $(voteAcceptBtnSelector);
    const form = $(voteProcessFormSelector);

    btn.click(function (e) {
        e.preventDefault();
        sendVoteProcess(form);
    });


    const modal = $(voteAcceptModalSelector);
    modal.on('hide.bs.modal', function () {
        const msgBlock = $(acceptModalFormMessage);
        msgBlock.text('').removeClass('fail success');
    });
}

const locRadioSelector = '[data-loc="check"]';
const locRadioBoxSelector = '[data-loc="box"]';
const locTitleSelector = '[data-loc="title"]';
const locTitleValBoxSelector = '[data-loc="valBox"]';
const locTitleValSelector = '[data-loc="title"]';

function hideLocValBox() {
    $(locTitleValBoxSelector).removeClass('v');
}

function showLocValBox() {
    $(locTitleValBoxSelector).addClass('v');
}

function setLocVal(text) {
    $(locTitleValBoxSelector).find(locTitleValSelector).text(text);
}

function locRadioChange(input) {
    input = $(input);

    const par = input.parents(locRadioBoxSelector);
    if (!par) return false;

    const titleBlock = par.find(locTitleSelector);
    if (!titleBlock) return false;

    const text = titleBlock.text();
    if (!text || !text.length) return false;

    setLocVal(text);
    showLocValBox();
}

function initLocRadio() {
    $(locRadioSelector).each(function (i, input) {
        input = $(input);

        input.on('change', function () {
            locRadioChange(input);
        });
    });

    const checked = $(locRadioSelector).filter(':checked');
    if (checked.length) locRadioChange(checked[0]);
}


const blockScreenSelector = '[data-screen="block"]';

function showBlockScreen() {
    $(blockScreenSelector).addClass('v');
}

function hideBlockScreen() {
    $(blockScreenSelector).removeClass('v');
}


// Settings
function getDateFromString(dateStr) {
    if (typeof dateStr !== 'string') return false;

    const parts = dateStr.split('.');
    if (parts.length !== 3) return false;

    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);

    if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return false;

    const date = new Date(year, month, day);
    return date;
}

/*
const validateDateSelector = '[data-validate="date"]';

function initValidateDateInput() {
    $(validateDateSelector).each(function(i, item) {
        $(this).on('blur', function() {
            const val = $(this).val();
            const momentDate = moment(val, 'DD.MM.YYYY', true);
            if (momentDate.isValid()) return true;
            $(this).val('');
        });
    });
}
*/

const datepickerSelector = '[data-datepicker]';

function checkDate(val) {
    const momentDate = moment(val, 'DD.MM.YYYY', true);
    if (momentDate.isValid()) return true;
    return false;
}

function initDatepicker() {
    const minDate = new Date(1900, 0, 1, 0, 0, 0);
    const maxDate = new Date(2021, 11, 31, 0, 0, 0);

    $(datepickerSelector).each(function (i, item) {
        item = $(item);

        const dp = item.datepicker({
            autoClose: true,
            minDate: minDate,
            maxDate: maxDate
        });

        const value = item.attr('value');
        const defDate = getDateFromString(value);
        if (defDate) dp.data('datepicker').selectDate(defDate);

        item.on('focusout', function (e) {
            ////console.log(e, e.originalEvent.type);

            //if (!e.hasOwnProperty('originalEvent') || e.originalEvent.type !== "focusout") return false;

            const val = $(this).val();

            if (!moment(val, 'DD.MM.YYYY', true).isValid()) {
                $(this).val('');
                return false;
            }

            const date = getDateFromString(val);
            //console.log(date);
            if (date > maxDate || date < minDate) {
                $(this).val('');
                return false;
            }

            if (e.hasOwnProperty('originalEvent') && e.originalEvent.type !== "blur") {
                dp.data('datepicker').selectDate(date);
            }
        });
    });
}


const userSettingsFormSelector = '[data-form="userSettings"]';
const formMessageBlock = '[data-block="formMessage"]';
const regionFormSelector = '[data-field="regionSelect"]';
const cityFormSelector = '[data-field="citySelect"]';
const genderFormSelector = '[data-field="genderSelect"]';
const dateMaskSelect = '[data-inputmask="date"]';

function userSettingsSend(form) {
    form = $(form);

    const msgBlock = form.find(formMessageBlock);
    msgBlock.text('').removeClass('fail success');

    const inputList = form.find('input, select');
    const validate = validateFieldList(inputList);
    if (!validate) return;

    const data = prepareFormData(inputList);

    $.ajax({
        url: '/udata/users/userSettings.json',
        type: 'POST',
        dataType: 'json',
        data: data
    }).done(function (d) {
        //console.log('done', d);

        if (d.status === 'ok') {
            msgBlock.text('Данные сохранены').addClass('success');
            ajaxRedirect(d, 1500);
        } else {
            msgBlock.text('Произошла ошибка').addClass('fail');
        }
    }).fail(function (f) {
        //console.log('fail', f);
        msgBlock.text('Произошла ошибка').addClass('fail');
    });
}


function initSelectizeInput(input) {
    input = $(input);

    const selectizeSetiings = {
        create: false,
        sortField: {
            field: "text",
            direction: "asc",
        },
        dropdownParent: "body",
        onFocus: function () {
            unsetErrorInput(input);
        }
    };

    input.selectize(selectizeSetiings);
}


function getRegionCitiesAjax(id, done = null, fail = null) {
    const data = { id: id };

    $.ajax({
        url: '/udata/content/getRegionCities.json',
        type: 'POST',
        dataType: 'json',
        data: data
    }).done(function (d) {
        ////console.log('done', d);
        if (done) done(d);
    }).fail(function (f) {
        ////console.log('fail', f);
        if (fail) fail(d);
    });
}

function initSettingsSelectize(form) {
    const regionSelect = form.find(regionFormSelector);
    if (!regionSelect.length) return;

    const citySelect = form.find(cityFormSelector);
    if (!citySelect.length) return;


    citySelect.selectize({
        create: false,
        sortField: { field: "text", direction: "asc", },
        dropdownParent: "body",
        onFocus: function () { unsetErrorInput(citySelect); }
    });


    regionSelect.selectize({
        create: false,
        sortField: { field: "text", direction: "asc", },
        dropdownParent: "body",
        onChange: function (id, title) {
            citySelect[0].selectize.clearOptions();
            citySelect[0].selectize.disable();

            getRegionCitiesAjax(id,
                function (d) {
                    if (d.status === 'ok') {
                        ////console.log(d.regions);

                        const options = [];
                        for (i in d.regions) {
                            const item = d.regions[i]
                            const option = {
                                value: item.id,
                                text: item.title
                            };
                            options.push(option);
                        }

                        citySelect[0].selectize.addOption(options);
                        if (options.length) citySelect[0].selectize.enable();
                    }
                },
                function (f) { }
            );
        },
        onFocus: function () { unsetErrorInput(regionSelect); }
    });


    const genderSelect = form.find(genderFormSelector);
    if (!genderSelect.length) return;

    genderSelect.selectize({
        create: false,
        sortField: { field: "text", direction: "asc", },
        dropdownParent: "body",
        onFocus: function () { unsetErrorInput(citySelect); }
    });
}

function initDateMask() {
    input = $(dateMaskSelect);
    input.mask('99.99.9999');
}

function initUserSettings() {
    const form = $(userSettingsFormSelector);

    form.on('submit', function (e) {
        e.preventDefault();
        userSettingsSend(form);
    });

    initSettingsSelectize(form);
}


$(function () {
    var projectPageSlider = $(".project-report-images");

    projectPageSlider.owlCarousel({
        items: 1,
        nav: true,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
    });
});


// PLANTING
const plantingFormSelector = '[data-form="addPlanting"]';
const settlementFormSelector = 'select[name="settlement"]';
const locationFormSelector = 'select[name="location"]';
const treeAmountFormSelector = 'select[name="tree_amount"]';
const seedlingPriceFormSelector = 'select[name="seedling_price"]';
const seedlingPriceInputSelector = 'input[name="seedling_price"]';

function plantingFormSend(form) {
    form = $(form);

    const msgBlock = form.find(formMessageBlock);
    msgBlock.text('').removeClass('fail success');

    const inputList = form.find('input, select, textarea');
    const validate = validateFieldList(inputList);
    if (!validate) {
        msgBlock.text('Есть незаполненные поля').addClass('fail');
        return;
    }

    const data = preparePlantingFormData(inputList);

    console.log(data);

    const button = form.find('button[type="submit"]');
    button.attr('disabled', true);

    $.ajax({
        url: '/udata/content/greenFieldForm.json',
        type: 'POST',
        dataType: 'json',
        data: data
    }).done(function (d) {
        console.log('done', d);

        if (d.status === 'ok') {
            msgBlock.text('Данные сохранены').addClass('success');
            ajaxRedirect(d, 1500);
        } else {
            button.attr('disabled', false);
            msgBlock.text('Произошла ошибка').addClass('fail');
        }
    }).fail(function (f) {
        console.log('fail', f);
        button.attr('disabled', false);
        msgBlock.text('Произошла ошибка').addClass('fail');
    });
}

function toggleSeedlingPriceInput(status) {
    const seedlingPriceInput = $(seedlingPriceInputSelector);
    if (!seedlingPriceInput.length) return;

    if (status) {
        seedlingPriceInput.data('required', true);
    } else {
        seedlingPriceInput.data('required', false);
        seedlingPriceInput.val('');
        unsetErrorInput(seedlingPriceInput);
    }

    const seedlingPriceInputBlock = seedlingPriceInput.closest('.input-block');
    if (!seedlingPriceInputBlock.length) return;

    seedlingPriceInputBlock.css('display', status ? 'block' : 'none');
}

function initPlantingFormSelectize(form) {
    const settlementSelect = form.find(settlementFormSelector);
    const locationSelect = form.find(locationFormSelector);
    const treeAmountSelect = form.find(treeAmountFormSelector);
    const seedlingPriceSelect = form.find(seedlingPriceFormSelector);

    if (locationSelect.length) {
        locationSelect.selectize({
            create: false,
            sortField: { field: "text", direction: "asc", },
            dropdownParent: "body",
            onFocus: function () { unsetErrorInput(locationSelect); }
        });
    }

    if (settlementSelect.length) {
        settlementSelect.selectize({
            create: false,
            sortField: { field: "text", direction: "asc", },
            dropdownParent: "body",
            onChange: function (id, title) {

            },
            onFocus: function () { unsetErrorInput(settlementSelect); }
        });
    }

    if (treeAmountSelect.length) {
        treeAmountSelect.selectize({
            create: false,
            dropdownParent: "body",
            onFocus: function () { unsetErrorInput(treeAmountSelect); }
        });
    }

    if (seedlingPriceSelect.length) {
        seedlingPriceSelect.selectize({
            create: false,
            dropdownParent: "body",
            onChange: function (id, title) {
                if (id == 'Иное') {
                    toggleSeedlingPriceInput(true);
                } else {
                    toggleSeedlingPriceInput();
                }
            },
            onFocus: function () { unsetErrorInput(seedlingPriceSelect); }
        });
    }
}

function preparePlantingFormData(list) {
    const data = {};

    list.each(function (i, item) {
        const type = $(item).attr('type');
        const name = $(item).attr('name');
        const value = $(item).val();

        if (value && name) {
            switch (type) {
                case 'checkbox':
                    if (!name.includes('[]')) {
                        data[name] = $(item).is(':checked');
                    } else if ($(item).is(':checked')) {
                        data.hasOwnProperty(name) ? Array.isArray(data[name]) ? data[name].push(value) : data[name] = [data[name], value] : data[name] = value;
                    }
                    break;
                case 'radio':
                    if ($(item).is(':checked')) data[name] = value;
                    break;
                default:
                    data[name] = value;
                    break;
            }
        }
    });

    return data;
}

function initPlantingForm() {
    const form = $(plantingFormSelector);

    form.on('submit', function (e) {
        e.preventDefault();
        plantingFormSend(form);
    });

    form.on('change', function (e) {
        const target = e.target;

        const type = $(target).attr('type');
        if (inArray(type, ['checkbox', 'radio'])) {
            resetCheckboxError(target);
        }
    })

    initPlantingFormSelectize(form);
    $('input[type="tel"]').mask("+7 999 999-99-99");
}


document.addEventListener("DOMContentLoaded", function () {
    addVoteFormInit();
    initDateMask();
    initUserSettings();
    initPlantingForm();
    initDatepicker();
    initLocRadio();
    initVoteOpenModalBtn();
    initVoteProcessBtn();
    initLensIcon();
    initOtherCheck();
    initAnswerDraft();
    initAnswerOtherTextDraft();
    initObjectDraft();
    initObjectAnswerDraft();
    initObjectAnswerOtherTextDraft();
});
