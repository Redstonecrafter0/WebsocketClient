function escapeHtml(html){
    let text = document.createTextNode(html);
    let p = document.createElement('p');
    p.appendChild(text);
    return p.innerHTML;
}
const message_history = document.getElementById('message_history')
const send_button = document.getElementById('send_button')
let ws = null;
function addMessage(message, out) {
    let p = document.createElement('p')
    p.appendChild(document.createTextNode(message))
    if (out) {
        p.className = 'outbound msg'
    } else {
        p.className = 'inbound msg'
    }
    message_history.appendChild(p)
}
function addLog(message) {
    let p = document.createElement('p')
    p.appendChild(document.createTextNode(message))
    p.className = 'log_msg'
    message_history.appendChild(p)
}
document.getElementById('connect_button').addEventListener('click', e => {
    e.preventDefault()
    if (ws == null) {
        send_button.disabled = true
        message_history.innerHTML = ''
        ws = new WebSocket(document.getElementById('ws_url').value)
        ws.onconnect = () => {
            send_button.disabled = false
            addLog('Connected...')
        }
        ws.onclose = () => {
            ws = null
            send_button.disabled = false
            addLog('Disconnected...')
        }
    } else {
        ws.disconnect()
    }
})
send_button.addEventListener('click', e => {
    e.preventDefault()
    addMessage(e.target.parentElement.children[0].value, true)
    e.target.parentElement.children[0].value = ''
})
