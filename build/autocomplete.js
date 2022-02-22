var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const createAutoComplete = (config) => {
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
    const onInput = (e) => __awaiter(void 0, void 0, void 0, function* () {
        const items = yield config.fetchData(e.target.value);
        if (!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }
        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active');
        for (let item of items) {
            const option = document.createElement('a');
            option.classList.add('dropdown-item');
            option.innerText = config.renderOption(item);
            option.addEventListener('click', e => {
                dropdown.classList.remove('is-active');
                input.value = config.inputValue(item);
                config.onOptionSelect(item);
            });
            resultsWrapper.appendChild(option);
        }
    });
    input.addEventListener('input', debounce(onInput));
    document.addEventListener('click', e => {
        if (!config.root.contains(e.target)) {
            dropdown.classList.remove('is-active');
        }
    });
};
