export default class chat {
    constructor(api, form) {
        this.api = api
        this.userID = ''
        this.form = form
        this.api.addCallback('users-list', this.usersList.bind(this))
        this.api.addCallback('chat-info', this.chatInfo.bind(this))
        this.api.addCallback('output-message', this.outputMessage.bind(this))
        this.currentUser = undefined
        this.users = new Map()

        const exitButton = form.getElementsByClassName('exit_button')[0]
        exitButton.addEventListener('click', this.exitButtonClick.bind(this))

        const messageInput = form.getElementsByClassName('chat_input')[0]
        messageInput.addEventListener('keydown', this.messageKeydown.bind(this))
    }

    registrationSuccess() {
        this.userID = localStorage.getItem('userID')
        this.api.send({operation: 'users-list'})
    }

    usersList(data) {
        if (!data.success) {
            console.log(data.error)
            return
        }

        const users = this.form.getElementsByClassName('users')[0]
        for (let index = -(users.children.length -1); index <= 0; index++ ) {
            let e = users.children[-index]
            e.removeEventListener('click', this.userClick.bind(this))
            e.remove()
        }
        this.users.clear()
        let currentUser = undefined
        data.users_list.forEach((userInf) => {
            if (userInf.id === this.userID) {
                return
            }
            const user = document.createElement('div')
            user.dataset.ID = userInf.id;
            user.classList.add('user')
            user.innerHTML = `<span class="user-name">${userInf.name}</span>`
            user.addEventListener('click', this.userClick.bind(this))
            if (this.currentUser === userInf.id) {
                user.classList.add('user-select')
                currentUser = userInf.id
            }
            users.appendChild(user)
            this.users.set(userInf.id, userInf.name)
        })

        if (currentUser === undefined) {
            this.currentUser = undefined
            const chat = this.form.getElementsByClassName('chat')[0]
            chat.classList.add('chat_none')
        }
    }

    userClick(event) {
        const users = this.form.getElementsByClassName('user')
        for (const e of users) {
            if (e.classList.contains('user-select')) {
                if (e === event.target) return
                e.classList.remove('user-select')
            }
        }
        event.currentTarget.classList.add('user-select')
        this.currentUser = event.currentTarget.dataset.ID

        this.api.send({operation: 'chat-info', user_id: this.userID, recipient_id: this.currentUser})
    }

    messageKeydown(event) {
        if (event.keyCode !== 13) {
            return
        }
        const message = event.currentTarget.value
        this.api.send({
            operation: 'send-message',
            user_id: this.userID,
            recipient_id: this.currentUser,
            message: message
        })
        event.currentTarget.value = ''
    }

    chatInfo(data) {
        if (!data.success) {
            console.log(data.error)
            return
        }

        const chat = this.form.getElementsByClassName('chat')[0]
        chat.classList.remove('chat_none')

        const messages = chat.getElementsByClassName('messages')[0]
        messages.innerHTML = ''
        for (let message of data.messages) {
            const messageDiv = this.createMessageDiv(message)
            messages.appendChild(messageDiv)
        }

    }

    outputMessage(data) {
        if (data.message.user_id !== this.currentUser && data.message.user_id !== this.userID) return
        const message = this.createMessageDiv(data.message)
        const messages = this.form.getElementsByClassName('messages')[0]
        messages.appendChild(message)
    }

    createMessageDiv(message) {
        const formatter = new Intl.DateTimeFormat("ru", {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });

        const date = formatter.format(new Date(message.time)).replace(',', "")

        const messageDiv = document.createElement('div')
        if (message.user_id === this.userID) {
            messageDiv.classList.add('outgoing')
            messageDiv.innerHTML = `
                <span class="outgoing-text"> ${message.text} </span>
                <span class="outgoing-date"> ${date} </span>`
        } else {
            messageDiv.classList.add('incoming')
            messageDiv.innerHTML = `
                <span class="incoming-author">${this.users.get(message.user_id)}:</span>
                <span class="incoming-text"> ${message.text} </span>
                <span class="incoming-date"> ${date} </span>`
        }
        return messageDiv
    }

    exitButtonClick() {
        // this.userID = ''
        // localStorage.removeItem('userID')
        // const exitButton = form.getElementsByClassName('exit_button')[0]
        // exitButton.classList.add('exit_button_none')
        //
        // const users = this.form.getElementsByClassName('users')[0]
        // for (const e of users.children) {
        //     e.removeEventListener('click', this.userClick.bind(this))
        //     e.remove()
        // }
        //
        // const modal = document.getElementsByClassName('registration')[0]
        // modal.classList.remove('registration_none')
        //
        // const chat = this.form.getElementsByClassName('chat')[0]
        // chat.classList.add('chat_none')
    }

}