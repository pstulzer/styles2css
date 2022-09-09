export const GetFontWeight = (w = "") => {
    let weight = w.split(" ")
    /*
    100	fein	        Thin        (Hairline)
    200	extraleicht	    Extra Light (Ultra Light)
    300	leicht	        Light
    400	normal	        Normal      (Regular)
    500	medium	        Medium
    600	halbfett	    Semi Bold   (Demi Bold)
    700	fett	        Bold
    800	extrafett	    Extra Bold  (Ultra Bold)
    900	schwarz 	    Black       (Heavy)
    950	extraschwarz	Extra Black (Ultra Black)

     */
    switch (weight[0].toLowerCase()) {
        case "fein":
            return 100
            break
        case "haarlinie":
            return 100
            break
        case "thin":
            return 100
            break
        case "extraleicht":
            return 200
            break
        case "extra light":
            return 200
            break
        case "leicht":
            return 300
            break
        case "light":
            return 300
            break
        case "normal":
            return 400
            break
        case "regular":
            return 400
            break
        case "medium":
            return 500
            break
        case "halbfett":
            return 600
            break
        case "semi bold":
            return 600
            break
        case "demi bold":
            return 600
            break
        case "fett":
            return 700
            break
        case "bold":
            return 700
            break
        case "extrafett":
            return 800
            break
        case "extra bold":
            return 800
            break
        case "ultra bold":
            return 800
            break
        case "schwarz":
            return 900
            break
        case "black":
            return 900
            break
        case "heavy":
            return 900
            break
        case "extraschwarz":
            return 950
            break
        case "extra black":
            return 950
            break
        case "ultra black":
            return 950
            break
        default:
            return 400
            break
    }
}
