export const GetTextCase = (c = "") => {
    switch (c.toLowerCase()) {
        case "title":
            return "capitalize"
            break
        case "upper":
            return "uppercase"
            break
        case "lower":
            return "lowercase"
            break
        default:
            return "none"
            break
    }
}
