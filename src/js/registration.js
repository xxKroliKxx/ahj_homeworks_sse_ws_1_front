export default class registration {
    constructor(api, element, registrationCallback) {
        this.api = api
        this.element = element
        this.api.addCallback('registration', this.responseHandler.bind(this))
        this.registrationSuccess = registrationCallback

        const button = this.element.getElementsByClassName('registration_button')[0]
        button.addEventListener('click', () => this.buttonClick())
    }

    buttonClick() {
        const input = this.element.getElementsByClassName('registration_input')[0]
        this.api.send({operation: 'registration', name: input.value})
    }

    responseHandler(data) {
        if (!data.success) {
            console.log(data.error)
            return
        }
        localStorage.setItem('userID', data.user_id)
        this.element.classList.add('registration_none')
        this.registrationSuccess()
    }

}