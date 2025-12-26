class APIResponse {
    constructor(data, message, statusCode) {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
        this.success = true;
    }
}

export default APIResponse;