import {ExtractValue} from "./extractValue";

export const ExtractUnit = (value) => value.slice(ExtractValue(value).toString().length).trim();
