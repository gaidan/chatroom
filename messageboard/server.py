from datetime import datetime
import socket
from thread import start_new_thread, allocate_lock
from random import randint

# Prepare socket for server
sS = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sS.bind(('', 80))
sS.listen(1)

rooms = ["gaming", "general", "politics", "music", "programming"]
imgtyp = [".jpg", ".png"]

lock = allocate_lock()

# Main loop
def servercode(sS, imgtyp, cS, addr):
    global rooms
    try:
        msg = cS.recv(1024)
    except:
        print('Failed to read message')
        cS.send('Something went wrong!')
    print("[{}] > [{}] {}".format(datetime.now().strftime("%d/%m/%Y-%H:%M:%S"), msg[0:4].strip(), addr[0]))
    f = open('log.txt', 'a+')
    f.write("=========================\n")
    f.write("[{}] > [{}] {}\n".format(datetime.now().strftime("%d/%m/%Y-%H:%M:%S"), msg[0:4].strip(), addr[0]))
    f.write("{}\n".format(msg))
    f.write("=========================\n")
    f.close()
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
        elif request_url == '/createroom':
            roomid = randint(1000, 9999)
            while str(roomid) in rooms:
                roomid = randint(1000, 9999)
            cS.send("""\
HTTP/1.1 200 OK

<a href="/msg&room={}">to the room!</a>""".format(roomid))
            newroom = open('data/msghistory{}.txt'.format(roomid), 'a+')
            newroom.write('00/00/0000-00:00:00 #6461452670109732450 mamurluk > Welcome to private channel #{}! Use code {} to join from the homepage!\n'.format(roomid, roomid))
            newroom.close()
            # cS.send('<a href="/msg&room={}">to the room!</a>'.format(roomid))
            lock.acquire()
            rooms.append(str(roomid))
            lock.release()
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
        start_new_thread(servercode, (sS, imgtyp, cS, addr))

sS.close()
