import { Movie } from './index'

export const createAutoComplete = (config: { root: HTMLElement, renderOption: Function, onOptionSelect: Function, inputValue: Function, fetchData?: any }): void => {
    config.root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;

    const input = config.root.querySelector('input');
    const dropdown = config.root.querySelector('.dropdown');
    const resultsWrapper = config.root.querySelector('.results');

    const onInput = async (e: Event) => {
        const items = await config.fetchData((<HTMLInputElement>e.target!).value);

        if (!items.length) {
            dropdown!.classList.remove('is-active');
            return;
        }

        resultsWrapper!.innerHTML = ''
        dropdown!.classList.add('is-active');

        for (let item of items) {
            const option = document.createElement('a');
            option.classList.add('dropdown-item');
            option.innerText = config.renderOption(item);

            option.addEventListener('click', e => {
                dropdown!.classList.remove('is-active');
                input!.value = config.inputValue(item);
                config.onOptionSelect(item);
            });

            resultsWrapper!.appendChild(option);
        }
    };

    input!.addEventListener('input', debounce(onInput));

    document.addEventListener('click', e => {
        if (!config.root.contains(<HTMLElement>e.target)) {
            dropdown!.classList.remove('is-active');
        }
    });
};