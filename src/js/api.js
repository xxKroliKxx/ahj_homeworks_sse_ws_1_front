export default class api {
    constructor(wsClient) {
        this.client = wsClient
        this.client.addEventListener('message', (response) => this.message(response))
        this.callbacks = new Map()
    }

    message(response) {
        const respStructure = JSON.parse(response.data)
        const callback = this.callbacks.get(respStructure.operation)
        callback(respStructure)
    }

    send(response) {
        this.client.send(JSON.stringify(response))
    }

    addCallback(operation, callback) {
        this.callbacks.set(operation, callback)
    }
}
