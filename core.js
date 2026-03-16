export default class Core {

    constructor(publicKey, sandbox = false) {
        this.publicKey = publicKey;
        this.sandbox = sandbox;
    }

    url(url) {
        const domain_name = this.sandbox
            ? "devapi.slick-pay.com"
            : "prodapi.slick-pay.com";

        return `https://${domain_name}/api/v2/${url}`;
    }

    response(status, data, error) {
        // Consider any 4xx or 5xx status as failed (not just 401 and 500)
        var failed = (data && data.errors) || status >= 400;

        const response = {
            data: !failed ? data : null,
            status: status,
            errors: failed
                ? (data && data.errors
                    ? data.errors
                    : (data && data.message
                        ? { server: [data.message] }
                        : { server: [error] }))
                : null,
        };

        if (!failed && response.data) Object.assign(response, response.data);
        if (!failed && response.data && response.data.data) delete response.data.data;

        return response;
    }
}
