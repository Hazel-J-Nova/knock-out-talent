//jshint esversion:9


class ExpressError extends Error{
    construtor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
}

module.exports = ExpressError;