export const GetFontStyle = (s = "") => {
    let style = s.split(" ")

    if (style.length > 1) {
        switch (style[1].toLowerCase()) {
            case "italic":
                return "italic"
                break
            case "oblique":
                return "oblique"
                break
            default:
                return "normal"
                break
        }
    } else {
        return "normal"
    }
};
