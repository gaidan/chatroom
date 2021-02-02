from datetime import datetime
import socket
import thread

# Prepare socket for server
sS = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sS.bind(('', 80))
sS.listen(1)

rooms = ["gaming", "general", "politics", "music", "programming"]
imgtyp = [".jpg", ".png"]

# Main loop
def servercode(sS, rooms, imgtyp, cS, addr):
    try:
        msg = cS.recv(1024)
    except:
        print('Failed to read message')
        cS.send('Something went wrong!')
    print("{} {}".format(addr[0], msg[0:4]))
    if msg[0:4] == "GET ":
        request_url = msg[4:msg.find('HTTP/1.1')-1]
        if request_url == '/':
            cS.send(open('assets/index.html').read())
        elif '/msg&room=' in request_url:
            room = request_url[10:len(request_url)]
            if room in rooms:
                messagehistory = open('data/msghistory{}.txt'.format(room)).read().replace('\n', '<br>')
                cS.send(open('assets/chatroom.html').read().format(room, messagehistory, room))
            else:
                cS.send('404')
        else:
            try:
                cS.send(open('assets/{}'.format(request_url)).read())
            except:
                cS.send('404')
    elif msg[0:4] == "POST":
        request_url = msg[5:msg.find('HTTP/1.1')-1]
        if '/msg&room=' in request_url:
            room = request_url[10:len(request_url)]
            room = str(room)
            if room in rooms:
                formdata = msg[msg.find('username='):len(msg)]
                username = formdata[9:formdata.find('&')]
                message = formdata[formdata.find('&')+9:len(msg)]
                msghisf = open('data/msghistory{}.txt'.format(room), 'a+')
                time = datetime.now().strftime("%d/%m/%Y-%H:%M:%S")
                msghisf.write('{} #{} {} > {}\n'.format(time, abs(hash(addr[0])), username.replace("+", ""), message.replace("+", " ")))
                msghisf.close()
                messagehistory = open('data/msghistory{}.txt'.format(room)).read().replace('\n', '<br>')
                cS.send(open('assets/chatroom.html').read().format(room, messagehistory, room))
            else:
                cS.send('404')
        else:
            try:
                cS.send(open('assets/{}'.format(request_url)).read())
            except:
                cS.send('404')
    else:
        cS.send('501')
    #except Exception as e:
    #    cS.send('Something went wrong!')
    #    print(e)
    cS.close()

while True:
	cS, addr = sS.accept()
	thread.start_new_thread(servercode, (sS, rooms, imgtyp, cS, addr))

sS.close()
