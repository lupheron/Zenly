export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
