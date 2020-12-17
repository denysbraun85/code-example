class UserPickerFunctional {
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.addItemBtn = this.element.querySelector('.js-responsible-persons__button--add');
        this.cardList = this.element.querySelector('.js-responsible-persons-list');
        this.cards = [...this.cardList.querySelectorAll('.js-pick-user-card')];
        //Pick User Block
        let userBlock = this.element.querySelector('.js-pick-user'),
            userList = userBlock.querySelector('.js-pick-user__tabs-holder'),
            userListItems = [...userList.querySelectorAll('.js-pick-user-card')],
        //Tabs
            tabLinks = [...this.element.querySelectorAll('.js-pick-user__tab-link')],
            tabContent = [...this.element.querySelectorAll('.js-pick-user__tab-content')],
        //Search
            search = this.element.querySelector('.js-input-search-case'),
            searchInput = search.querySelector('.js-input-search-case__input'),
            loopIcon = search.querySelector('.js-input-search-case__icon-loop'),
            clearIcon = search.querySelector('.js-input-search-case__icon-clear');

        //Set Dropdown Position (Pick User Block)
        window.addEventListener('load', () => {
            this.setBlockPosition(this.element, userBlock);
        })

        window.addEventListener('scroll', () => {
            this.setBlockPosition(this.element, userBlock);
        })


        //Dropdown Item Image (if image empty)
        userListItems.forEach( el => {

            let imageBlock = el.querySelector('.js-pick-user-card__image-block'),
                img = imageBlock.querySelector('.js-pick-user-card__image'),
                infoBlock = el.querySelector('.js-pick-user-card__info-block'),
                bgColor = el.getAttribute('data-bg'),
                itemName = infoBlock.querySelector('.js-pick-user-card__name');

            //Checking Image
            if(!img){

                let nameArray = itemName.textContent.split(' ');

                imageBlock.classList.add('pick-user-card__image-block--no-image');
                imageBlock.textContent = nameArray[0][0].toUpperCase() + nameArray[1][0].toUpperCase();
                imageBlock.setAttribute('style', `background-color: ${bgColor};`);

            }

            //Click on User From List
            el.addEventListener('click', (e) => {

                let imageBlock = el.querySelector('.js-pick-user-card__image-block'),
                    image = imageBlock.querySelector('.js-pick-user-card__image'),
                    imageLink,
                    itemName = el.querySelector('.js-pick-user-card__name').textContent,
                    itemPost = el.querySelector('.js-pick-user-card__post').textContent,
                    itemDepartment = el.getAttribute('data-department'),
                    itemBg = el.getAttribute('data-bg'),
                    itemContacts = el.getAttribute('data-contacts'),
                    itemId = el.getAttribute('data-id');

                if (!el.classList.contains('selected')) {

                    //Check if no Image
                    if (!image) {
                        imageLink = '';
                    } else {
                        imageLink = imageBlock.querySelector('.js-pick-user-card__image').getAttribute('src');
                    }

                    //Build Card from List
                    el.classList.add('selected');

                    //Remove ident card with the same id number
                    this.cards.forEach( elem => {
                        if (elem.getAttribute('data-id') === itemId) {
                            elem.remove();
                        }
                    })

                    this.createCard(imageLink, itemName, itemPost, itemId, itemDepartment, itemBg, this.cardList, userListItems, itemContacts);
                    this.removeShowAllItemsBlock(this.element);
                    this.checkItemsAmount(this.cardList);

                } else {

                    //Remove Card from List
                    el.classList.remove('selected');

                    this.removeCard(this.cardList, itemId);
                    this.removeShowAllItemsBlock(this.element);
                    this.checkItemsAmount(this.cardList);

                }

                if (e.target.closest('.js-pick-user-card__remove-btn')) {

                    let items = [...this.cardList.querySelectorAll('.js-pick-user-card')];

                    e.target.closest('.js-pick-user-card').remove();

                    //Remove ident card with the same id number
                    this.removeIdentCards(userListItems, itemId);
                    this.removeIdentCards(items, itemId);

                }

                //Check all cards from all tabs
                userListItems.find( elem => {

                    if (elem.getAttribute('data-id') === el.getAttribute('data-id')) {

                        if (el.classList.contains('selected')) {
                            elem.classList.add('selected');
                        } else {
                            elem.classList.remove('selected');
                        }

                    }

                })

            })

        });

        //Click Events inside Element
        this.element.addEventListener('click', e => {

            if (e.target.closest('.js-responsible-persons__button--add') &&
                e.target.closest('.js-responsible-persons__button--add').classList.contains('active')  ||
                e.target.closest('.js-pick-user')) {

                this.openList(this.addItemBtn, userBlock);

            }

            if (e.target.closest('.js-input-search-case__icon-clear')) {
                searchInput.value = '';
                this.notActiveSearch(loopIcon, clearIcon);
                this.showAllCards(userListItems);
                this.removeSearchError(userList);
            }

            if (e.target.closest('.js-pick-user-card__remove-btn') && !e.target.closest('.handpicked')) {
                this.openList(this.addItemBtn, userBlock);
            }

        })

        //Exceptions for closing element
        document.addEventListener('click', (e) => {

            if (e.target.closest('.js-pick-user__close-btn')) {
                this.closeList(this.addItemBtn, userBlock);
            }

            if (!e.target.closest(selector)) {
                if (e.target.closest('.js-pick-user-card__remove-btn') && !e.target.closest('.handpicked')) {
                    return false;
                } else {
                    this.closeList(this.addItemBtn, userBlock);
                }
            }

        });

        //Tabs
        tabLinks.forEach( el => {
            el.addEventListener('click', (e) => {
                let linkTarget = e.currentTarget,
                    contentTab = linkTarget.getAttribute('id');

                tabContent.forEach( el => {
                    el.classList.remove('active');
                })

                tabLinks.forEach( el => {
                    el.classList.remove('active');
                })

                this.element.querySelector(`[data-tab="${contentTab}"]`).classList.add('active');
                linkTarget.classList.add('active');

            });
        })

        //Live search
        searchInput.addEventListener('input', () => {

            let val = searchInput.value.trim().toLowerCase();

            if (val !== '') {

                this.activeSearch(loopIcon, clearIcon);

                let cardLength = userListItems.length,
                    count = 0;

                userListItems.forEach( el => {

                    let name = el.querySelector('.js-pick-user-card__name'),
                        nameLower = el.querySelector('.js-pick-user-card__name').innerText.toLowerCase();

                    if (nameLower.search(val) === -1) {

                        el.classList.add('hide-card');
                        name.innerHTML = name.innerText;
                        count++;

                        if (count === cardLength) {
                            this.renderSearchError(userList);
                        } else {
                            this.removeSearchError(userList);
                        }

                    } else {

                        el.classList.remove('hide-card');
                        count--;
                        let str = name.innerText;
                        name.innerHTML = this.setMark(str, nameLower.search(val), val.length);

                    }

                })

            } else {

                this.notActiveSearch(loopIcon, clearIcon);
                this.showAllCards(userListItems);

            }

        })

    }

    openList(btn, list) {
        btn.classList.remove('active');
        list.classList.add('open');
    }

    closeList(btn, list) {
        btn.classList.add('active');
        list.classList.remove('open')
    }

    createCard(image, name, post, id, department, bgColor, holder, allCards, contacts){

        //Main Block
        let div = document.createElement('div');
        div.classList.add('pick-user-card', 'js-pick-user-card', 'handpicked');
        div.dataset.department = department;
        div.dataset.id = id;

        //Image Block
        let imageBlock = document.createElement('div');
        imageBlock.classList.add('pick-user-card__image-block', 'js-pick-user-card__image-block');

        if (image === '') {

            let nameArray = name.split(' ');

            imageBlock.textContent = nameArray[0][0].toUpperCase() + nameArray[1][0].toUpperCase();
            imageBlock.classList.add('pick-user-card__image-block--no-image');
            imageBlock.setAttribute('style', `background-color: ${bgColor};`);

        } else {

            let img = document.createElement('img');

            img.classList.add('pick-user-card__image', 'js-pick-user-card__image');
            img.setAttribute('src', image);
            imageBlock.insertAdjacentElement('beforeend', img);

        }

        //Info Block
        let infoBlock = document.createElement('div');
        infoBlock.classList.add('pick-user-card__info-block', 'js-pick-user-card__info-block');

        //Name
        let userName = document.createElement('p');
        userName.classList.add('pick-user-card__name', 'js-pick-user-card__name');
        userName.textContent = name;
        userName.setAttribute('title', `${name}`);

        //Post
        let userPost = document.createElement('p');
        userPost.classList.add('pick-user-card__post', 'js-pick-user-card__post');
        userPost.textContent = post;
        userPost.setAttribute('title', `${post}`);

        //Button
        let button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.classList.add('pick-user-card__remove-btn', 'js-pick-user-card__remove-btn');

        //Icon
        let btnIcon = document.createElement('i');
        btnIcon.classList.add('icon', 'wtg-plus');
        button.insertAdjacentElement('afterbegin', btnIcon);

        div.insertAdjacentElement('afterbegin', imageBlock);
        imageBlock.insertAdjacentElement('afterend', infoBlock);
        infoBlock.insertAdjacentElement('afterbegin', userName);
        infoBlock.insertAdjacentElement('beforeend', userPost);
        infoBlock.insertAdjacentElement('afterend', button);

        //Event for Button If need to Delete Card
        div.addEventListener('click', (e) => {

            let button = e.target.closest('.js-pick-user-card__remove-btn');

            if (button) {

                let card = e.target.closest('.js-pick-user-card');

                card.remove();

                allCards.forEach( el => {

                    let itemId = el.getAttribute('data-id');

                    if (id === itemId) {
                        el.classList.remove('selected');
                    }

                })

                this.removeShowAllItemsBlock(this.element);
                this.checkItemsAmount(this.cardList);

            } else {
                return false;
            }

        })

        holder.insertAdjacentElement('beforeend', div);


        if (this.element.hasAttribute('data-target') && this.element.getAttribute('data-target') === 'partner-managers') {

            //Wrapper
            let wrapper = document.createElement('div');
            wrapper.classList.add('card-wrapper');

            div.classList.add('pick-user-card--partner-manager');

            //Move Sort Button
            let sortButton = document.createElement('button');
            sortButton.classList.add('pick-user-card__sort-btn', 'js-pick-user-card__sort-btn', 'sort-btn');
            sortButton.setAttribute('type', 'button');

            //Sort Button Icon
            let buttonIcon = document.createElement('span');
            btnIcon.classList.add('pick-user-card__sort-icon');
            sortButton.insertAdjacentElement('afterbegin', buttonIcon);

            wrapper.insertAdjacentElement('afterbegin', sortButton);

            //Info Block
            let contactsBlock = document.createElement('div');
            contactsBlock.classList.add('pick-user-card__contacts-block', 'js-pick-user-card__contacts-block');

            if (contacts !== null) {

                let obj = JSON.parse(contacts);

                for (let key in obj) {

                    if (obj.hasOwnProperty(key)) {

                        let contactItem = document.createElement('div');
                        contactItem.classList.add('pick-user-card__contact-item', `pick-user-card__contact-item--${key}`, 'js-pick-user-card__contact-item');

                        let itemAmount = document.createElement('span');
                        itemAmount.classList.add('pick-user-card__contact-amount');
                        itemAmount.textContent = `${obj[key]}`;

                        contactItem.insertAdjacentElement('beforeend',itemAmount);
                        contactsBlock.insertAdjacentElement('afterbegin',contactItem);

                        let itemIcon = document.createElement('i');

                        switch (key) {
                            case ('mail'):
                                itemIcon.classList.add('icon', 'wtg-envelope_2', 'pick-user-card__contact-icon');
                                contactItem.insertAdjacentElement('afterbegin',itemIcon);
                                break
                            case ('phone'):
                                itemIcon.classList.add('icon', 'wtg-phone_full', 'pick-user-card__contact-icon');
                                contactItem.insertAdjacentElement('afterbegin',itemIcon);
                                break
                            case ('whatsApp'):
                                itemIcon.classList.add('icon', 'wtg-whatsapp-1', 'pick-user-card__contact-icon');
                                contactItem.insertAdjacentElement('afterbegin',itemIcon);
                                break
                        }

                    }

                }

            } else {

                contactsBlock.classList.add('pick-user-card__contacts-block--no-contacts');
                contactsBlock.textContent = `No contacts`;

            }


            infoBlock.insertAdjacentElement('afterend', contactsBlock);
            wrapper.insertAdjacentElement('afterbegin', div);

            holder.insertAdjacentElement('beforeend', wrapper);

        }



    }

    removeCard(list, removeItemId){

        let items = [...list.querySelectorAll('.js-pick-user-card')];

        items.forEach( el => {

            let itemId = el.getAttribute('data-id');

            if (itemId === removeItemId) {
                el.remove();
            }

        })
    }

    checkItemsAmount(list) {

        let listItems = [...list.querySelectorAll('.js-pick-user-card')];

        if (this.element.hasAttribute('data-target') && this.element.getAttribute('data-target') === 'partner-managers') {

            if (listItems.length > 3) {
                list.classList.add('responsible-persons-list--limit-height-160px');
                this.createShowAllItemsBlock(list,listItems.length);
            } else {
                list.classList.remove('responsible-persons-list--limit-height-160px');
            }

        } else {

            if (listItems.length > 6) {
                list.classList.add('responsible-persons-list--limit-height');
                this.createShowAllItemsBlock(list,listItems.length);
            } else {
                list.classList.remove('responsible-persons-list--limit-height');
            }

        }


    }

    createShowAllItemsBlock(holder, itemsLength) {

        let itemsLeft;

        if (this.element.hasAttribute('data-target') && this.element.getAttribute('data-target') === 'partner-managers') {
            itemsLeft = itemsLength - 3;
        } else {
            itemsLeft = itemsLength - 6;
        }

        let div = document.createElement('div');
        div.classList.add('show-more', 'js-show-more');

        let span = document.createElement('span');
        span.classList.add('show-more__text', 'js-show-more');
        span.textContent = `Show more (${itemsLeft})`;

        let i = document.createElement('i');
        i.classList.add('icon', 'wtg-arrow', 'show-more__icon');

        div.insertAdjacentElement('afterbegin', span);
        span.insertAdjacentElement('afterend', i);

        holder.insertAdjacentElement('afterend', div);

        div.addEventListener('click', (e) => {

            if (e.target.closest('.js-show-more')) {
                holder.classList.remove('responsible-persons-list--limit-height', 'responsible-persons-list--limit-height-160px');
                div.remove();
            }

        })

    }

    removeShowAllItemsBlock(parent){

        let showMoreBlock = parent.querySelector('.js-show-more');

        if (!showMoreBlock) {
            return false;
        } else {
            showMoreBlock.remove();
        }

    }

    setMark(string, position, len) {
        return string.slice(0, position) + '<mark>' + string.slice(position, position + len) + '</mark>' + string.slice(position + len);
    }

    activeSearch(loop, cross) {
        loop.classList.remove('active');
        cross.classList.add('active');
    }

    notActiveSearch(loop, cross) {
        loop.classList.add('active');
        cross.classList.remove('active');
    }

    removeIdentCards(elements, id) {
        elements.forEach( elem => {
            if (elem.getAttribute('data-id') === id) {
                elem.remove();
            }
        })
    }

    showAllCards(cards) {
        cards.forEach( el => {

            let name = el.querySelector('.js-pick-user-card__name');

            el.classList.remove('hide-card');
            name.innerHTML = name.innerText;
        });
    }

    setBlockPosition(mainBlock, elementBlock) {

        let topDistance = mainBlock.getBoundingClientRect().top - 64;

        //Y
        if (topDistance > elementBlock.getBoundingClientRect().height) {
            elementBlock.classList.add('pick-user--above');
        } else {
            elementBlock.classList.remove('pick-user--above');
        }

        //X
        if (window.innerWidth - mainBlock.getBoundingClientRect().right < 500) {
            elementBlock.classList.add('pick-user--pull-left');
        } else {
            elementBlock.classList.remove('pick-user--pull-left');
        }

    }

    renderSearchError(tabsHolderBox) {

        let p = document.createElement('p'),
            error = tabsHolderBox.querySelector('.js-input-search-case__error');

        p.classList.add('input-search-case__error', 'js-input-search-case__error');
        p.textContent = 'No matches';

        if (!error) {
            tabsHolderBox.insertAdjacentElement('afterbegin', p);
        } else {
            return false;
        }

    }

    removeSearchError(tabsHolderBox) {
        let error = tabsHolderBox.querySelector('.js-input-search-case__error');

        if (error) {
            error.remove();
        } else {
            return false;
        }

    }

}
