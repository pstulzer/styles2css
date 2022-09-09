export const CustomTimeout = (t) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, t);
    });
};
