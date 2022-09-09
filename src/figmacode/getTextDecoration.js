export const GetTextDecoration = (d = "") => {
    switch (d.toLowerCase()) {
        case "strikethrough":
            return "line-through"
            break
        case "underline":
            return "underline"
            break
        default:
            return "none"
            break
    }
}
