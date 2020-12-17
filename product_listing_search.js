class ProductListingSearchForm {
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.searchBlock = this.element.querySelector('.product-listing-search-holder');
        this.optionBlock = this.element.querySelector('.js-product-listing-additional-option-holder');
        this.sortItems = Array.from(this.searchBlock.querySelectorAll('.product-sort-item'));
        this.formChildrenButton = this.searchBlock.querySelector('.js-search-form-children');
        this.clearBtn = this.element.querySelector('.clear');
        this.searchBtn = this.element.querySelector('.search');
        this.formElements = Array.from(this.element.elements);
        this.dropdowns = Array.from(this.element.querySelectorAll('.dropdown__multiselect'));

        //Product Sort
        this.sortItems.forEach( el => {

            el.addEventListener( 'click', () => {

                if (el.classList.contains('disabled')) {
                    el.classList.remove('disabled');
                    el.classList.add('active-lower');
                } else if (el.classList.contains('active-lower')) {
                    el.classList.remove('active-lower');
                    el.classList.add('active-higher');
                } else {
                    el.classList.remove('active-lower');
                    el.classList.remove('active-higher');
                    el.classList.add('disabled');
                }


            });

        });

        //Open-Close Option Block
        this.formChildrenButton.addEventListener('click', event => {

            if(event.target.closest('.js-search-form-children') || event.target.closest('.js-dropdown-icon')){

                if(this.optionBlock.classList.contains('open')){
                    this.close();
                    this.slideUp();
                } else {
                    this.open();
                    this.slideDown();
                }

            }

        });

        //Close Outside Option Block
        document.addEventListener('click', event => {

            if(!event.target.closest('.js-product-listing-additional-option-holder') && !event.target.closest('.js-search-form-children')){
                this.close();
                this.slideUp();
            }

        });

        //Clear Form
        this.clearBtn.addEventListener('click', () => {

            this.dropdowns.forEach( el => {

                let menu = el.querySelector('.dropdown__menu'),
                    labels = menu.querySelectorAll('.dropdown__menu__item__label');

                this.defaultMenuList(labels);

                if(el.hasAttribute('data-include-search')){

                    let search = el.querySelector('.dropdown__search'),
                        loop = search.querySelector('.loop-search'),
                        clearSearchBtn = search.querySelector('.clear-search');

                    this.defaultSearchIcon(loop, clearSearchBtn);
                    this.removeSearchError(menu);


                } else {
                    return false;
                }

            });

        });

        //Search
        this.searchBtn.addEventListener('click', () => {

            this.formElements.forEach( el => {

                let type = el.getAttribute('type');

                if(el.checked === true){
                    console.log(el);
                }

                if(type === 'number' && el.value !== ''){
                    console.log(el);
                }

                if(type === 'text' && el.value !== '' && !el.classList.contains('search__input')){
                    console.log(el);
                }

            });
        });


    }

    open(){
        this.optionBlock.classList.add('open');
        this.formChildrenButton.classList.add('active');
    }

    close(){
        this.optionBlock.classList.remove('open');
        this.formChildrenButton.classList.remove('active');
    }

    slideUp(duration = 300){

        this.optionBlock.style.transitionProperty = 'height, opacity, visibility';
        this.optionBlock.style.transitionDuration = duration + 'ms';
        this.optionBlock.style.height = this.optionBlock.offsetHeight + 'px';
        this.optionBlock.offsetHeight;
        this.optionBlock.style.overflow = 'hidden';
        this.optionBlock.style.height = 0;
        this.optionBlock.style.opacity = 0;
        this.optionBlock.style.visibility = 'hidden';

        this.timeOutOff(duration);

    }

    slideDown(duration = 300){

        this.optionBlock.style.removeProperty('display');

        let display = window.getComputedStyle(this.optionBlock).display;

        if (display === 'none'){

            display = 'flex';

            this.optionBlock.style.display = display;

            let height = this.optionBlock.offsetHeight;

            this.optionBlock.style.height = 0;
            this.optionBlock.style.opacity = 1;
            this.optionBlock.style.visibility = 'visible';
            this.optionBlock.offsetHeight;
            this.optionBlock.style.transitionProperty = "height, opacity, visibility";
            this.optionBlock.style.transitionDuration = duration + 'ms';
            this.optionBlock.style.height = height + 'px';

            this.timeOutOn(duration);

        }


    }

    timeOutOff(time){

        window.setTimeout( () => {

            this.optionBlock.style.display = 'none';
            this.optionBlock.style.removeProperty('height');
            this.optionBlock.style.removeProperty('opacity');
            this.optionBlock.style.removeProperty('visibility');
            this.optionBlock.style.removeProperty('overflow');
            this.optionBlock.style.removeProperty('transition-duration');
            this.optionBlock.style.removeProperty('transition-property');

        }, time);

    }

    timeOutOn(time){

        window.setTimeout( () => {

            this.optionBlock.style.removeProperty('height');
            this.optionBlock.style.removeProperty('opacity');
            this.optionBlock.style.removeProperty('visibility');
            this.optionBlock.style.removeProperty('overflow');
            this.optionBlock.style.removeProperty('transition-duration');
            this.optionBlock.style.removeProperty('transition-property');

        }, time);

    }

    defaultSearchIcon(searchIcon, resetIcon){
        searchIcon.classList.add('active');
        resetIcon.classList.remove('active');
    }

    defaultMenuList(items){
        items.forEach( el => {
            if(!el.classList.contains('search__label')){

                let item = el.closest('.dropdown__menu__item');

                el.style.display = '';
                el.classList.remove('selected');
                item.classList.remove('selected');

            }
        })
    }

    removeSearchError(menu){
        let error = menu.querySelector('.dropdown__search__error');
        if(error){
            error.remove();
        } else {
            return false;
        }
    }

    displaySelectedOptions(counter){
        if(counter > 0){
            this.title.textContent = `(${counter}) ${this.titleText}`
        } else {
            this.title.textContent = this.titleText;
        }
    }

}
