//Copy link to clipboard  and Tooltip
let inputs = [...document.querySelectorAll('.js-input-link-block')];

inputs.forEach( el => {

    let input = el.querySelector('.js-input-link-block__input'),
        tooltip = el.querySelector('.input-link-block__tooltip');

    document.addEventListener('click' , (e) => {

        if (e.target.closest('.js-input-link-block__button')) {

            input.select();
            input.setSelectionRange(0, 99999);
            document.execCommand("copy");
            el.classList.add('active');
            tooltip.textContent = `Copied!`;
            input.blur();

        } else {

            el.classList.remove('active');
            tooltip.textContent = `Copy`;

        }

    })

});