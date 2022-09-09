// SCSS
// LESS
// CSS
export const BuildColorOutput = (setup, arr = []) => {
    let ret = "";
    if (Array.isArray(arr) && arr.length > 0) {
        for (let index in arr) {
            if (arr[index].type === "color") {
                // console.log("createOutput", arr[index]);
                if (setup.lang === "SCSS") {
                    ret = ret + "$";
                }
                if (setup.lang === "LESS") {
                    ret = ret + "@";
                }
                if (setup.lang === "CSS") {
                    ret = ret + "  --";
                }
                ret = ret + arr[index].cssname + ": " + arr[index].cssvalue + ";\n";
            }
            if (arr[index].type === "text") {
                for (let prop in arr[index].properties) {
                    if (setup.lang === "SCSS") {
                        ret = ret + "$";
                    }
                    if (setup.lang === "LESS") {
                        ret = ret + "@";
                    }
                    if (setup.lang === "CSS") {
                        ret = ret + "  --";
                    }

                    let name = arr[index].properties[prop].cssname;
                    let value = arr[index].properties[prop].cssvalue;

                    if (arr[index].properties[prop].cssproperty === "font-family") {
                        value = "\"" + arr[index].properties[prop].cssvalue + "\"";
                    }
                    ret = ret + name + ": " + value + ";\n";
                }
            }
        }
    }
    return ret;
}
