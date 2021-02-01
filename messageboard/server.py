from datetime import datetime
import socket

# Prepare socket for server
sS = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sS.bind(('', 80))
sS.listen(1)

# Main loop
while True:
    cS, addr = sS.accept()
    try:
        msg = cS.recv(2048)
    except:
        print('Failed to read message')
        cS.send('Something went wrong!')
    print("{} {}".format(addr[0], msg[0:4]))
    try:
        if msg[0:4] == "GET ":
            request_url = msg[4:msg.find('HTTP/1.1')-1]
            if request_url == '/':
                cS.send(open('assets/index.html').read())
            elif request_url == '/msg':
                messagehistory = open('data/msghistory.txt').read().replace('\n', '<br>')
                cS.send(open('assets/chatroom.html').read().format(messagehistory))
            else:
                try:
                    cS.send(open('assets/{}'.format(request_url)).read())
                except:
                    cS.send('404')
        elif msg[0:4] == "POST":
            request_url = msg[5:msg.find('HTTP/1.1')-1]
            if request_url == '/msg':
                formdata = msg[msg.find('username='):len(msg)]
                username = formdata[9:formdata.find('&')]
                message = formdata[formdata.find('&')+9:len(msg)]
                msghisf = open('data/msghistory.txt', 'a+')
                time = datetime.now().strftime("%d/%m/%Y-%H:%M:%S")
                msghisf.write('{} #{} {} > {}\n'.format(time, abs(hash(addr[0])), username.replace("+", ""), message.replace("+", " ")))
                msghisf.close()
                messagehistory = open('data/msghistory.txt').read().replace('\n', '<br>')
                cS.send(open('assets/chatroom.html').read().format(messagehistory))
            else:
                try:
                    cS.send(open('assets/{}'.format(request_url)).read())
                except:
                    cS.send('404')
        else:
            cS.send('501')
    except:
        cS.send('Something went wrong!')
    cS.close()
