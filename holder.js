/*
|--------------------------------------------------------------------------
| Get parent container ('content')
|--------------------------------------------------------------------------
*/

$('.object-feature-holder').parent('.content').addClass('general-object-holder');

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

//Main
new AdminDropdownSingle('#city__dropdown');
new AdminDropdownSingle('#type__dropdown');
// new AdminDropdownSingle('#market__dropdown');
//Partner
new AdminDropdownSingle('#partner__dropdown');
new AdminDropdownSingle('#partner_residence__dropdown');
new AdminDropdownSingle('#phase_residence__dropdown');
new AdminDropdownSingle('#under_phase_residence__dropdown');

/*
|--------------------------------------------------------------------------
| CKEditor
|--------------------------------------------------------------------------
*/

$(function () {

    let editors = Array.from(document.querySelectorAll('[data-ckeditor-init="init"]'));

    editors.forEach(el => {

        CKEDITOR.replace(el);

    });

});

/*
|--------------------------------------------------------------------------
| Video Tab
|--------------------------------------------------------------------------
*/

let addLinkBtn = Array.from(document.querySelectorAll('.add-link'));

const videoBlock = document.getElementById('video_block');

addLinkBtn.forEach( function (el) {

    el.addEventListener('click', function (e) {

       //Parent Link Holder
       let item = $(e.target).closest('.edit-input-case')[0];

       //Check For Only One New Link Holder
       // if(!item.classList.contains('copy-block')){
       //
       // } else {
       //     return false;
       // }
        createNewLink(item);

    })

});

//Remove Link
$(document).on('click', '.js-remove-link',  function (e) {

    //Link holder
    let item = $(e.target).closest('.new-link')[0];

    //Remove link
    removeLink(item);
    $(videoBlock)[0].innerHTML = ' ';

});

//Create New Video Link
function createNewLink(element){

    //Take id
    let elementId = element.getAttribute('id');

    //Add Check Class
    element.classList.add('copy-block');

    //Create main box
    let holder = document.createElement('div');
        holder.classList.add('edit-input-case', 'new-link');

    //Create input
    let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('id', `${elementId + '_new_video_link'}`);

    //Create label
    let label = document.createElement('label');
        label.setAttribute('for', `${elementId + '_new_video_link'}`);

    //Create button box
    let button_holder = document.createElement('div');
        button_holder.classList.add('btn-case');

    //Create button remove
    let span_remove_btn = document.createElement('span');
        span_remove_btn.classList.add('remove-link', 'js-remove-link');

    //Create icon remove
    let icon_remove = document.createElement('i');
        icon_remove.classList.add('icon', 'wtg-plus', 'new-link-remove');

    //Create button play
    let span_play_btn = document.createElement('span');
        span_play_btn.classList.add('play-video', 'js-play-video');

    //Create icon play
    let icon_play = document.createElement('i');
        icon_play.classList.add('icon', 'wtg-video', 'new-link-play');

    //-------------Container assembly
    //Insert input
    holder.insertAdjacentElement('afterbegin', input);
    //Insert label
    input.insertAdjacentElement('afterend', label);
    //Insert button box
    holder.insertAdjacentElement('beforeend', button_holder);
    //-------------Insert buttons into button box
    //Insert button add/remove
    button_holder.insertAdjacentElement('afterbegin', span_remove_btn);
    //Insert icon
    span_remove_btn.insertAdjacentElement('afterbegin', icon_remove);
    //Insert button play
    button_holder.insertAdjacentElement('beforeend', span_play_btn);
    //Insert icon
    span_play_btn.insertAdjacentElement('afterbegin', icon_play);

    //Return block
    $(element)[0].insertAdjacentElement('afterend', holder);

}

//Remove Video Link
function removeLink(element){

    //Delete Check Class
    element.previousSibling.classList.remove('copy-block');

    //Remove Block
    element.remove();

}

/*
|--------------------------------------------------------------------------
| Show Video (video tab)
|--------------------------------------------------------------------------
*/

class ShowVideo {
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.frame = this.element.querySelector('.video-container');


        document.addEventListener('click', e => {

            if(e.target.classList.contains('wtg-video')){

                let button = $(e.target).closest('.edit-input-case')[0];
                let link = button.querySelector('input').value;

                this.element.innerHTML = '';

                if(this.isValidUrl(link)){

                    this.createVideoIframe(this.element, this.correctUrl(link));

                } else {

                    this.createErrorBlock(this.element);

                }


            }


        });


        //Press ENTER
        document.addEventListener('keypress', e => {

            if(e.target.classList.contains('js-input-link')){

                let button = $(e.target).closest('.edit-input-case')[0];
                let link = button.querySelector('input').value;

                if(e.keyCode === 13){

                    if(this.isValidUrl(link)){

                        this.element.innerHTML = '';
                        this.createVideoIframe(this.element, this.correctUrl(link));

                    } else {

                        this.element.innerHTML = '';
                        this.createErrorBlock(this.element);

                    }

                }

            }

        });


        //On Keyboard Delete
        document.addEventListener('input', e => {

            if(e.target.classList.contains('js-input-link')){

                let button = $(e.target).closest('.edit-input-case')[0];
                let link = button.querySelector('input').value;

                if(link === ''){
                    this.element.innerHTML = '';
                }

            }

        });


        //Clear Video Block
        $(document).on('click', '.js-play-video', () => {

            this.element.innerHTML = '';

        });


    }

    createErrorBlock(parentBlock) {

        let block = document.createElement('div');
        block.classList.add('error-block');

        let messageBox = document.createElement('div');
        messageBox.classList.add('message-box');

        let img = document.createElement('img');
        img.setAttribute('src', imgPath);

        let title = document.createElement('p');
        title.classList.add('error-title');
        //titleError take from resources/views/admin-product/holder/comment/index.blade.php
        title.textContent = titleError;

        let errorDescription = document.createElement('p');
        errorDescription.classList.add('error-description');
        //textError take from resources/views/admin-product/holder/comment/index.blade.php
        errorDescription.textContent = textError;

        //Circles
        let circle_1 = document.createElement('span');
        circle_1.classList.add('circle-1');
        block.insertAdjacentElement('afterbegin', circle_1);

        let circle_2 = document.createElement('span');
        circle_2.classList.add('circle-2');
        circle_1.insertAdjacentElement('afterend', circle_2);

        let circle_3 = document.createElement('span');
        circle_3.classList.add('circle-3');
        circle_2.insertAdjacentElement('afterend', circle_3);

        let circle_4 = document.createElement('span');
        circle_4.classList.add('circle-4');
        circle_3.insertAdjacentElement('afterend', circle_4);

        let circle_5 = document.createElement('span');
        circle_5.classList.add('circle-5');
        circle_4.insertAdjacentElement('afterend', circle_5);

        let circle_6 = document.createElement('span');
        circle_6.classList.add('circle-6');
        circle_5.insertAdjacentElement('afterend', circle_6);


        messageBox.insertAdjacentElement('afterbegin', img);
        img.insertAdjacentElement('afterend', title);
        messageBox.insertAdjacentElement('beforeend', errorDescription);

        block.insertAdjacentElement('beforeend', messageBox);

        parentBlock.insertAdjacentElement('afterbegin', block);
    }

    createVideoIframe(parentBlock, link) {

        let block = document.createElement('div');
            block.classList.add('video-container');

        let iframe = document.createElement('iframe');
            iframe.classList.add('video');
            iframe.setAttribute('id', 'video_show_frame');
            iframe.setAttribute('src', link);
            iframe.setAttribute('allowfullscreen', true);


        block.insertAdjacentElement('afterbegin', iframe);

        parentBlock.insertAdjacentElement('afterbegin', block);

    }

    isValidUrl(link){

        let objRE =/https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;

        return objRE.test(link);

    }

    correctUrl(link){

        let id = link.slice(link.indexOf('=') + 1, link.length);

        return `https://www.youtube.com/embed/${id}`;
    }

}

new ShowVideo('#video_block');


/*
|--------------------------------------------------------------------------
| Sort photos (photo holder)
|--------------------------------------------------------------------------
*/

const sortBox = document.getElementById('sort_container');

$(document).ready(function () {

    $(sortBox).sortable({
        revert: 300
    });

});

//Image Width And Height (Photo Tab)
let image_boxes = Array.from(sortBox.querySelectorAll('.image-case'));

image_boxes.forEach(el => {

    let image = el.querySelector('img'),
        imageSizeBlock = el.querySelector('.img-size');

    imageSizeBlock.textContent = `${image.naturalWidth}x${image.naturalHeight}`;

});

/*
|--------------------------------------------------------------------------
| Input file (upload button)
|--------------------------------------------------------------------------
*/

class UploadPhoto {
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.amount = this.element.closest('.label').querySelector('.amount');
        this.files = this.element.files.length;

        this.element.addEventListener('change', () => {

            //Change Text To Image Name
            if(this.element.files.length > 0){
                this.show();
                this.addText();
            } else {
                this.hide();
                this.removeText();
            }

        })
    }

    //Show Element
    show(){
        this.amount.classList.remove('hide');
        this.amount.classList.add('show');
    }

    //Hide Element
    hide(){
        this.amount.classList.remove('show');
        this.amount.classList.add('hide');
    }

    //Add Amount Of Photo To Add
    addText(){
        this.amount.textContent  = this.element.files.length;
    }

    //Remove Amount Of Photo To Add
    removeText(){
        this.amount.textContent  = ' ';
    }

}

new UploadPhoto('#upload_photo_input');
