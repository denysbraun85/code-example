class DropdownMultiSelect{
    constructor(selector) {

        this.element = document.querySelector(selector);
        this.label = this.element.querySelector('.dropdown__label');
        this.title = this.label.querySelector('.dropdown__label__title');
        this.clearLabelBtn = this.label.querySelector('.js-clear-btn');
        this.titleText = this.title.textContent;
        this.menu = this.element.querySelector('.dropdown__menu');
        this.labels = this.menu.querySelectorAll('.dropdown__menu__item__label');

        let count = 0,
            countLabel = true;


        //Set Width For Long Dropdown
        this.setMenuWidth();

        //Open-Close Dropdown Menu
        this.element.addEventListener('click', event => {

            if(event.target.classList.contains('dropdown__label') || event.target.classList.contains('dropdown__label__title')){

                if(this.menu.classList.contains('open')){
                    this.close();
                } else {
                    this.open();
                }

            } else if(event.target.tagName.toLowerCase() === 'label') { //Select-Deselect Options

                //Special Select Dropdown Like Bedrooms and Bathrooms
                if(this.element.hasAttribute('data-special-select-options')){

                    let label = event.target,
                        li = label.closest('.dropdown__menu__item'),
                        input = label.previousElementSibling,
                        arrayOptions =[];

                    input.addEventListener('change', () => {

                        if(input.checked === true){

                            countLabel = false;

                            if(countLabel === false) {

                                for(let i = parseInt(label.textContent); i <= this.labels.length; i++){
                                    arrayOptions.push(i);
                                }

                                this.checkOnSpecialSelect(arrayOptions);
                                count = arrayOptions.length;
                                this.displaySelectedOptions(count);

                            }

                        } else {

                            if(label.classList.contains('selected')){

                                this.checkOff(label, li);
                                countLabel = true;
                                count--;
                                this.displaySelectedOptions(count);

                            }

                        }

                        console.log(count);

                        // if (count > 0) {
                        //     this.clearLabelBtn.classList.add('active');
                        // } else {
                        //     this.clearLabelBtn.classList.remove('active');
                        //
                        // }

                    });

                }
                //Default Select Dropdown
                else
                {

                    let label = event.target,
                        li = label.closest('.dropdown__menu__item'),
                        input = label.previousElementSibling;

                    input.addEventListener('change', () => {
                        if(input.checked === true){
                            this.checkOn(label, li);
                        } else {
                            this.checkOff(label, li);
                        }

                        //Show-hide Clear Label Btn
                        count > 0 ? this.clearLabelBtn.classList.add('active') : this.clearLabelBtn.classList.remove('active')

                    });

                    if(!label.classList.contains('selected')){
                        count++;
                        this.displaySelectedOptions(count);
                    } else {
                        count--;
                        this.displaySelectedOptions(count);
                    }

                }

            }


        });

        //Close Outside Menu
        document.addEventListener('click', event => {

            if(!event.target.closest(selector)){
                this.close();
            }

            //Clear Count If Form Reset
            if(event.target.closest('.clear')){
                count = 0;
                countLabel = true;
                this.displaySelectedOptions(count);
                this.showGroupTitle();
            }

            //Clear On Clear Label Button
            if (event.target.closest('.js-clear-btn')) {
                count = 0;
                countLabel = true;
                this.displaySelectedOptions(count);
                this.showGroupTitle();
                this.defaultMenuList(this.labels);
                this.resetAllOptions([...this.labels]);
                event.target.classList.remove('active');

                if (this.element.hasAttribute('data-include-search')) {

                    let search = this.menu.querySelector('.dropdown__search'),
                        input = search.querySelector('.search__input'),
                        loop = search.querySelector('.loop-search'),
                        clearSearchBtn = search.querySelector('.clear-search');

                    input.value = ''
                    this.defaultSearch(loop, clearSearchBtn);
                    this.removeSearchError(search);
                    this.showGroupTitle();

                }

            }

        });

        if(this.element.hasAttribute('data-include-search')){

            let search = this.menu.querySelector('.dropdown__search'),
                loop = search.querySelector('.loop-search'),
                clearSearchBtn = search.querySelector('.clear-search'),
                countArrayError = [],
                count = false,
                inputSearch = search.querySelector('.search__input');


            if(inputSearch.value !== ''){
                this.activeSearch(loop, clearSearchBtn);
            } else {
                this.defaultSearch(loop, clearSearchBtn);
            }

            inputSearch.addEventListener('keyup', () => {

                let filter = inputSearch.value.toLowerCase();

                //Clear Array On Each keypress
                countArrayError = [];

                if(filter !== ''){
                    this.activeSearch(loop, clearSearchBtn);
                } else {
                    this.defaultSearch(loop, clearSearchBtn);
                }

                for(let i = 0; i < this.labels.length; i ++){

                    let item = this.labels[i],
                        li = this.labels[i].closest('li'),
                        value = item.textContent;

                    if(!this.labels[i].classList.contains('search__label')){
                        if(value.toLowerCase().indexOf(filter) > -1){
                            this.labels[i].style.display = '';
                            li.style.display = '';
                            this.removeSearchError(search);
                            this.showGroupTitle();
                        } else {
                            this.labels[i].style.display = 'none';
                            li.style.display = 'none';
                            countArrayError.push(this.labels[i]);
                        }

                        if(filter === ''){
                            this.labels[i].style.display = '';
                            li.style.display = '';
                            countArrayError = [];
                            this.removeSearchError(search);
                            this.showGroupTitle();
                        }

                    }

                }

                //Error massage
                if(countArrayError.length === this.labels.length){
                    count = true;
                    this.removeSearchError(search);
                    this.renderSearchError(search);
                    this.hideGroupTitle();
                } else {
                    count = false;
                    countArrayError = [];
                    this.removeSearchError(search);
                    this.showGroupTitle();
                }


            });



            //Clear search
            clearSearchBtn.addEventListener('click', () => {

                inputSearch.value = '';
                this.defaultSearch(loop, clearSearchBtn);
                this.defaultMenuList(this.labels);
                this.removeSearchError(search);
                this.showGroupTitle();

            });

        }
    }

    setMenuWidth(){
        if(this.element.hasAttribute('data-select-width')){
            let width = window.getComputedStyle(this.menu).getPropertyValue('width');
            this.menu.setAttribute('style', `min-width: ${width}`);
        }
    }

    showGroupTitle(){

        let dropdownItems = Array.from(this.menu.querySelectorAll('.dropdown__menu__item'));

        dropdownItems.forEach( el => {

            if(el.classList.contains('group-title')){
                el.style.display = '';
            } else {
                return false;
            }

        });

    }

    hideGroupTitle(){

        let dropdownItems = Array.from(this.menu.querySelectorAll('.dropdown__menu__item'));

        dropdownItems.forEach( el => {

            if(el.classList.contains('group-title')){
                el.style.display = 'none';
            } else {
                return false;
            }

        });

    }

    defaultMenuList(items){
        items.forEach( el => {
            if(!el.classList.contains('search__label')){
                el.style.display = '';
                el.closest('li').style.display = '';
            }
        })
    }

    activeSearch(searchIcon, resetIcon){
        searchIcon.classList.remove('active');
        resetIcon.classList.add('active');
    }

    defaultSearch(searchIcon, resetIcon){
        searchIcon.classList.add('active');
        resetIcon.classList.remove('active');
    }

    open(){
        this.label.classList.remove('active');
        this.menu.classList.add('open');
    }

    close(){
        this.label.classList.add('active');
        this.menu.classList.remove('open');
    }

    displaySelectedOptions(counter){
        if(counter > 0){
            this.title.textContent = `(${counter}) ${this.titleText}`
        } else {
            this.title.textContent = this.titleText;
        }
    }

    checkOn(labelElement, liElement){
        labelElement.classList.add('selected');
        liElement.classList.add('selected');
    }

    checkOff(labelElement, liElement){
        labelElement.classList.remove('selected');
        liElement.classList.remove('selected');
    }

    checkOnSpecialSelect(array){

        array.forEach( el => {

            let label = this.labels[el - 1],
                li = label.closest('.dropdown__menu__item'),
                input = label.previousElementSibling;

            label.classList.add('selected');
            li.classList.add('selected');
            input.checked = true;

        });

    }

    renderSearchError(searchElement){

        let paragraph = document.createElement('p');
        paragraph.classList.add('dropdown__search__error');
        paragraph.textContent = 'No matches';

        searchElement.insertAdjacentElement('afterend', paragraph);

    }

    removeSearchError(){
        let error = this.menu.querySelector('.dropdown__search__error');
        if(error){
            error.remove();
        } else {
            return false;
        }
    }

    resetAllOptions(arrayLabels) {
        arrayLabels.forEach( el => {
            let input = el.previousElementSibling,
                li = el.closest('.dropdown__menu__item');

            input.checked = false;
            el.classList.remove('selected');
            li.classList.remove('selected');
        })
    }

}