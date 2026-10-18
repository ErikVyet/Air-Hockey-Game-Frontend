import type { ExtendErrorCode } from "../enums/ExtendErrorCode";

export interface IErrorMessage {
    code: ExtendErrorCode,
    message: string
}