const debounce = (func: Function, delay = 1000) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: unknown[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay)
    };
};