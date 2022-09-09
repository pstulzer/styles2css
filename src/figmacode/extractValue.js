export const ExtractValue = (value) => parseFloat(value.replace(/[^0-9.]/g, "").trim());
