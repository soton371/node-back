class APIResponse {
    constructor(data, message) {
        this.message = message;
        this.success = true;
        this.data = data;
    }
}

export default APIResponse;