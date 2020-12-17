//Upload photo Functional
let photoBlock = document.querySelector('[data-functional="upload-photo"]'),
    uploadBox = photoBlock.querySelector('.js-upload-photo__image-box'),
    cancelBtn = photoBlock.querySelector('.js-upload-photo__btn--cancel'),
    saveBtn = photoBlock.querySelector('.js-upload-photo__btn--save'),
    resetBtn = photoBlock.querySelector('.js-upload-photo__btn--change-photo'),
    input = photoBlock.querySelector('.js-upload-photo__input');

//Events

//Upload image event
input.addEventListener('change', (e) => readFileImage(e.currentTarget, uploadBox));
//Reset image
resetBtn.addEventListener('click', () => changeUploadImage(input, uploadBox));
//Cancel upload photo
cancelBtn.addEventListener('click', () => cancelUploadPhoto(photoBlock, uploadBox));
//Save photo
saveBtn.addEventListener('click', () => saveUploadImage(uploadBox, photoBlock, input));


const changeUploadImage = (uploadInput, croppieBox) => {
    $(croppieBox).croppie('destroy');
    uploadInput.click();
    croppieBox.parentNode.classList.add('no-image');
}

const readFileImage = (input, croppieBox) => {

    if (input.files && input.files[0]) {

        let reader = new FileReader();

        reader.addEventListener('load', e => {
            $(croppieBox).croppie({
                customClass: 'upload-photo__image-box--croppie-styles',
                url: e.target.result,
                viewport: {
                    width: 150,
                    height: 150,
                    type: 'circle'
                },
                boundary: {
                    width: 150,
                    height: 150
                }
            });
        })

        reader.readAsDataURL(input.files[0]);

        photoBlock.classList.add('selected-photo');
        croppieBox.parentNode.classList.remove('no-image');

    } else {
        croppieBox.parentNode.classList.add('no-image');
    }

}

const cancelUploadPhoto = (mainBox, croppieBox) => {
    $(croppieBox).croppie('destroy');
    mainBox.classList.remove('no-image', 'selected-photo', 'save-photo');
}

const saveUploadImage = (croppieBox, mainBlock, inputImage) => {
    $(croppieBox).croppie('result', {
        type: 'base64',
        quality: 1,
        circle: true
    })
        .then((pictureCode) => previewPhoto(pictureCode, mainBlock, croppieBox, inputImage));
}

const previewPhoto = (imageSrc, imageBox, uploadImgBox, inputImg) => {

    let image = document.createElement('img');

    image.classList.add('upload-photo__ready-image', 'js-upload-photo__ready-image');
    image.setAttribute('src', imageSrc);
    image.setAttribute('style', 'width: 50px; height: 50px;');
    imageBox.classList.add('save-photo');
    imageBox.classList.remove('selected-photo');

    let fixBtn = document.createElement('button');

    fixBtn.classList.add('upload-photo__fix-btn', 'js-upload-photo__fix-btn');
    fixBtn.setAttribute('type', 'button');

    let btnIcon = document.createElement('i');

    btnIcon.classList.add('upload-photo__fix-icon', 'icon', 'wtg-plus');

    fixBtn.insertAdjacentElement('afterbegin', btnIcon);
    uploadImgBox.insertAdjacentElement('beforeend', fixBtn);
    uploadImgBox.insertAdjacentElement('afterbegin', image);

    // console.log(image);

    $(uploadBox).croppie('destroy');

    fixBtn.addEventListener('click', () => {

        fixBtn.remove();
        image.remove();
        readFileImage(inputImg, uploadImgBox);

    });

}




