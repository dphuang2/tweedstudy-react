class Logger {
    constructor() {
        this.userItentifier = this.getGuid();
    }

    getGuid() {
        let out = "";
        const GUID_LENGTH = 32;
        const NUM_SYMBOLS = 16;
        for(let i = 0; i < GUID_LENGTH; i++) {
            out += Math.floor(Math.random() * NUM_SYMBOLS).toString(NUM_SYMBOLS)
        }
        return out;
    }

    setIdentifier(id) {
        this.userItentifier = id;
    }

    logInfo(message) {
        this._log(this.buildMessage("info", message));
    }

    logWarn(message) {
        this._log(this.buildMessage("warn", message));
    }

    logAlert(message) {
        this._log(this.buildMessage("alert", message));
    }

    _log(message) {
        // This will be OK for testing 
        console.log(message);
    }

    buildMessage(type, message) {
        return `${type}|${this.userItentifier}|${message}`;
    }
}

export let logger = new Logger();
