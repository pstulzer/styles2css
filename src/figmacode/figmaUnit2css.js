export const FigmaUnit2css = (u = "") => {
    switch (u.toLowerCase()) {
        case "pixel":
            return "px"
            break
        case "percent":
            return "%"
            break
        default:
            return "px"
            break
    }
}
