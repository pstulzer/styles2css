// kebab-case
// camelCase
// PascalCase
// snake_case
export const ConcatStyleName = (setup, str = "") => {
    const regSlash = /(\s*\/\s*)/gmi;
    const regDash = /(\s*-\s*)/gmi;
    const regWhite = /\s+/gmi;
    str = str.replace(regSlash, "-").replace(regDash, "-").replace(regWhite, "-");
    let arr = str.split("-");
    if (setup.style === "kebab-case" || setup.style === "snake_case") {
        arr = arr.map(item => {
            return item.toLowerCase();
        });

        if (setup.style === "kebab-case") {
            return arr.join("-");
        }
        return arr.join("_");
    }
    if (setup.style === "PascalCase" || setup.style === "camelCase") {
        arr = arr.map((item, index) => {
            item = item.toLowerCase();
            if (setup.style === "camelCase" && index === 0) {
                return item;
            }
            return item.charAt(0).toUpperCase() + item.slice(1);
        });
        return arr.join("");
    }
};
