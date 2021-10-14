const message_history = document.getElementById('message_history')
const send_button = document.getElementById('send_button')
const connect_button = document.getElementById('connect_button')
const ws_url = document.getElementById('ws_url')
let ws = null
const input_log = []

function addMessage(message, out) {
    if (ws !== null && out) {
        ws.send(message)
    }
    let p = document.createElement('p')
    p.appendChild(document.createTextNode(message))
    if (out) {
        p.className = 'outbound msg'
    } else {
        p.className = 'inbound msg'
    }
    p.innerHTML = p.innerHTML.replaceAll('\n', '<br>')
    message_history.appendChild(p)
    message_history.scrollTop = message.height
}

function addLog(message) {
    let p = document.createElement('p')
    p.appendChild(document.createTextNode(message))
    p.className = 'log_msg'
    message_history.appendChild(p)
    message_history.scrollTop = message.height
}

document.getElementById('connect_button').addEventListener('click', e => {
    e.preventDefault()
    if (ws == null) {
        connect_button.value = 'Connecting'
        connect_button.disabled = true
        send_button.disabled = true
        ws_url.disabled = true
        message_history.innerHTML = ''
        ws = new WebSocket(ws_url.value)
        addLog('Connecting...')
        ws.onopen = () => {
            connect_button.disabled = false
            send_button.disabled = false
            ws_url.disabled = false
            connect_button.value = 'Disconnect'
            addLog('Connected...')
        }
        ws.onmessage = (e) => {
            addMessage(e.data, false)
        }
        ws.onclose = () => {
            ws = null
            connect_button.disabled = false
            send_button.disabled = false
            ws_url.disabled = false
            connect_button.value = 'Connect'
            addLog('Disconnected...')
        }
    } else {
        ws.close()
    }
})
send_button.addEventListener('click', e => {
    e.preventDefault()
    let msg = e.target.parentElement.children[0].value
    input_log.push(msg)
    addMessage(msg.replaceAll('\\\\', '\\').replaceAll('\\n', '\n'), true)
    e.target.parentElement.children[0].value = ''
})

if (localStorage.getItem('lastIp') !== null) {
    ws_url.value = localStorage.getItem('lastIp')
}

ws_url.addEventListener('input', e => {
    if (e.target.value !== '' && e.target.value !== 'ws://localhost') {
        localStorage.setItem('lastIp', e.target.value)
    } else {
        localStorage.removeItem('lastIp')
    }
})
