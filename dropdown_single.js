/*
|--------------------------------------------------------------------------
| Dropdown Logic (single check item)
|--------------------------------------------------------------------------
*/

class AdminDropdownSingle {
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.label = this.element.querySelector('.dropdown__label');
        this.labelText = this.label.textContent;
        this.menu = this.element.querySelector('.dropdown__menu');
        this.inputs = this.menu.querySelectorAll('input');
        this.inputsLabels = this.menu.querySelectorAll('label');
        this.search = this.menu.querySelector('.dropdown__search');
        this.inputSearch = this.menu.querySelector('.search__input');
        this.labels = this.menu.querySelectorAll('label');


        //On click action
        this.element.addEventListener('click', event => {

            //If click was on element with class "dropdown__label"
            if(event.target.classList.contains('dropdown__label')){

                if(this.menu.classList.contains('open')){
                    this.close();
                } else {
                    this.open();
                }

                //If click was on element "li" from dropdown menu
            } else if(event.target.tagName.toLowerCase() === 'label'){
                this.text = event.target.textContent; //take text from li
                this.input = event.target.previousElementSibling; //take input
                this.select(this.text); //change text to label
                this.close(); //close menu


                this.removeCheckedInput(this.inputs); //clear all inputs
                this.input.setAttribute('checked', ''); //set checked to input

                this.removeCheckedLabelClass(this.inputsLabels); //clear all labels
                event.target.classList.add('checked-label'); //set checked class to label
            }

        });

        //Close on outside dropdown app
        document.addEventListener('click', event => {
            if(!$(event.target).closest(selector).length && !event.target.classList.contains('reset-btn')) {
                this.close();
            }
        });

        //Reset Dropdown
        this.label.addEventListener('click',  event =>{

            if(event.target.classList.contains('reset-btn')){

                this.clearSearch();

                //If open menu after reset needed
                // this.open();

            }

        });

        //If search exist
        if(this.search){

            this.loop = this.search.querySelector('.loop-search');
            this.clearSearchBtn = this.search.querySelector('.clear-search');


            if(this.inputSearch.value !== ''){
                this.activeSearch();
            } else {
                this.defaultSearch();
            }


            this.inputSearch.addEventListener('keyup', () => {

                let filter = this.inputSearch.value.toLowerCase();

                if(filter !== ''){
                    this.activeSearch();
                } else {
                    this.defaultSearch();
                }

                for(let i = 0; i < this.labels.length; i ++){

                    let item = this.labels[i],
                        value = item.textContent;

                    if(!this.labels[i].classList.contains('search__label')){
                        if(value.toLowerCase().indexOf(filter) > -1){
                            this.labels[i].style.display = '';
                        } else {
                            this.labels[i].style.display = 'none';
                        }

                        if(filter === ''){
                            this.labels[i].style.display = '';
                        }

                    }

                }


            });

            //Clear search
            this.clearSearchBtn.addEventListener('click', () => {

                this.clearSearch();
                this.defaultMenuList(this.labels);

            });


        }

    }

    //Select item
    select(itemText){
        this.label.textContent = itemText;
        this.label.classList.add('selected');
        this.createResetButton();
    }

    //Close
    close(){
        this.menu.classList.remove('open');
        this.label.classList.add('active');
    }

    //Open
    open(){
        this.menu.classList.add('open');
        this.label.classList.remove('active');
    }

    //Active Search
    activeSearch(){
        this.loop.classList.remove('active');
        this.clearSearchBtn.classList.add('active');
    }

    //Default Search
    defaultSearch(){
        this.loop.classList.add('active');
        this.clearSearchBtn.classList.remove('active');
    }

    //Clear Search
    clearSearch(){

        if(this.search){
            this.inputSearch.value = '';
            this.loop.classList.add('active');
            this.clearSearchBtn.classList.remove('active');
        }

        this.label.textContent = this.labelText;
        this.label.classList.remove('selected');
        this.removeCheckedInput(this.inputs);
        this.removeCheckedLabelClass(this.inputsLabels);
        this.defaultMenuList(this.labels);
    }

    //Default Menu List
    defaultMenuList(items){
        items.forEach( el => {
            if(!el.classList.contains('search__label')){
                el.style.display = '';
            }
        })
    }

    //Remove Class checked-label And Check Mark
    removeCheckedLabelClass(items){
        items.forEach( el => {
            el.classList.remove('checked-label');
        })
    }

    //Remove Attribute checked
    removeCheckedInput(items){
        items.forEach( el => {
            if(el.hasAttribute('checked')){
                el.removeAttribute('checked');
            }
        })
    }

    //Crete Reset Button To Dropdown Label
    createResetButton(){

        let spanElement = document.createElement('i');
        spanElement.classList.add('reset-btn');
        spanElement.classList.add('active');

        this.label.insertAdjacentElement('beforeend', spanElement);

    }
}
