const checkingRemovedObjects = (array, button, boxes, inputs) => {

    let checkInputs = [];

    array.forEach( el => {
        if (el.checked === true) {
            checkInputs.push(el);
        }
    });

    if (checkInputs.length !== 0) {
        notActiveRemoveBtn(button);
        showInputs(boxes);

        let mainHolder = document.querySelector('.content'),
            adminContentHolderWrap = document.querySelector('.content-wrapper'),
            html = document.querySelector('html');

        displayBlockOnPageOn(mainHolder, html, adminContentHolderWrap);
        renderConfirmBlock(mainHolder, checkInputs.length);

        document.addEventListener('click', (event) => {

            let confirmBlock = document.querySelector('.confirm__block');

            if (event.target.classList.contains('js-confirm__block__btn--no')) {
                removeConfirmBlock(confirmBlock);
                setTimeout( () => {
                    displayBlockOnPageOff(mainHolder, html, adminContentHolderWrap);
                }, 200);
            } else if (event.target.classList.contains('js-confirm__block__btn--yes')) {
                checkInputs.forEach( el => {

                    let cardId = el.closest('.js-card-remove').getAttribute('id'),
                        card = el.closest('.js-card-remove'),
                        inputId = el.getAttribute('data-id');

                    if (cardId === inputId) {
                        card.remove();
                    } else {
                        console.warn('Не співпадають id об"єкта і data-id input');
                    }

                });
                removeConfirmBlock(confirmBlock);
                setTimeout( () => {
                    displayBlockOnPageOff(mainHolder, html, adminContentHolderWrap);
                }, 200);
            }

        });

    } else {
        activeRemoveBtn(button);
        hideInputs(boxes);
        checkOff(inputs);
    }

};

const renderConfirmBlock = (holder, objects) => {

    let confirmBlock = document.createElement('div');
    confirmBlock.classList.add('confirm__block');

    let message = document.createElement('p');
    message.classList.add('confirm__block__message');
    message.textContent = `Are you sure, you want to delete ${objects} objects`;

    let btnGroup = document.createElement('div');
    btnGroup.classList.add('button-group');

    let btnNo = document.createElement('button');
    btnNo.classList.add('confirm__block__btn', 'confirm__block__btn--no', 'js-confirm__block__btn--no');
    btnNo.setAttribute('type', 'button');
    btnNo.textContent = `No`;

    let btnYes = document.createElement('button');
    btnYes.classList.add('confirm__block__btn', 'confirm__block__btn--yes', 'js-confirm__block__btn--yes');
    btnYes.setAttribute('type', 'button');
    btnYes.textContent = `Yes`;

    confirmBlock.insertAdjacentElement('afterbegin', message);
    message.insertAdjacentElement('afterend', btnGroup);
    btnGroup.insertAdjacentElement('afterbegin', btnNo);
    btnGroup.insertAdjacentElement('beforeend', btnYes);

    holder.insertAdjacentElement('afterend', confirmBlock);

    setTimeout( () => {
        confirmBlock.classList.add('show-block');
    }, 200);

};

const removeConfirmBlock = (block) => {
    block.classList.remove('show-block');
    setTimeout( () => {
        block.remove();
    }, 200);
};

const displayBlockOnPageOn = (pageHolder, pageHtml, pageContentWrap) => {
    pageHolder.classList.add('confirm-action');
    pageHtml.classList.add('confirm-block-open');
    pageContentWrap.classList.add('confirm-block-open');
};

const displayBlockOnPageOff = (pageHolder, pageHtml, pageContentWrap) => {
    pageHolder.classList.remove('confirm-action');
    pageHtml.classList.remove('confirm-block-open');
    pageContentWrap.classList.remove('confirm-block-open');
};

const activeRemoveBtn = (button) => {
    button.classList.add('active');
};

const notActiveRemoveBtn = (button) => {
    button.classList.remove('active');
};

const showInputs = (array) => {
    array.forEach( el => {
        el.classList.add('show-block');
    });
};

const hideInputs = (array) => {
    array.forEach( el => {
        el.classList.remove('show-block');
    });
};

const checkOn = (array) => {
    array.forEach( el => {
        el.checked = true;
    })
};

const checkOff = (array) => {
    array.forEach( el => {
        el.checked = false;
    })
};