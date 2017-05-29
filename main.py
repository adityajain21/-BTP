import requests
from flask import Flask, render_template, request, jsonify, redirect, url_for, redirect
from flaskext.mysql import MySQL

import subprocess
import os
import sys
import json
import time
import md5
import random
# from server


def hash(string, hash_value=True, flag=False):
	if flag:
		return hash_value
	m = md5.new()
	m.update(str(string))
	return m.hexdigest()


def get_random():
	return int(random.random() * 10000)

def sxor(s1,s2):    
    # convert strings to a list of character pair tuples
    # go through each tuple, converting them to ASCII code (ord)
    # perform exclusive or on the ASCII code
    # then convert the result back to ASCII (chr)
    # merge the resulting array of characters as a string
    x = ''.join(chr(ord(a) ^ ord(b)) for a,b in zip(s1,s2))
    return x.encode("hex")


app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route("/", methods=['GET','POST'])
def main():
	return render_template('index.html')

@app.route("/login", methods=['GET','POST'])
def login():
	return render_template('login.html')

@app.route("/register", methods=['GET','POST'])
def register():
	return render_template('register.html')

@app.route("/reregister", methods=['GET','POST'])
def reregister():
	return render_template('reregister.html')


@app.route("/upload-bio", methods=['GET'])
def upload_biomet():
	# print ""
	os.system("sh ad.sh")
	return "True", 200
	
@app.route("/login_submit", methods=['POST'])
def login_submit():
	# _bio = request.form['inputBio']
	_email = request.form['inputEmail']
	_password = request.form['inputPassword']

	# print "\n\n\n\n"
	# print "User Email Address: " + str(_email)
	# print "\n\n\n\n"	

	_rbi=1
	_c1=2
	_c2=3
	_c3=4
	_c4=5
	_c5=6

	packet=[ { 'rbi':_rbi, 'c1':_c1, 'c2':_c2, 'c3':_c3, 'c4':_c4, 'c5':_c5}]
	pkt = json.dumps(packet)
	# time.sleep(20)
	# print packet
	return pkt
	

@app.route("/server-compute", methods=['POST'])
def server_compute():
	c1 = request.form['c1']
	c2 = request.form['c2']
	c4 = request.form['c4']
	random_hash_value = c4
	c5 = request.form['c5']
	ei = request.form['ei']
	email_address = request.form['email_address']

	print "\n\n\n"
	print c1
	print c2
	print c5
	print ei
	print "\n\n\n"
	
	x = str(get_random())
	ui = sxor(hash(str(x) + ei), str(c2))
	c3p = hash(email_address + str(x))
	c4p = hash(c1 + c2 + c3p + ei + ui, random_hash_value, True)

	if c4p != c4:
		print "USER NOT AUTHENTICATED"
		return str(False), 401

	# user authenticated
	print "USER AUTHENTICATED"

	beta = str(get_random())
	c6 = str(sxor(hash(x), hash(email_address + x)))
	c7 = beta
	c8 = sxor(c2, ei)
	c9 = sxor(hash(email_address + x), ui)
	key = hash(c1 + c7 + c1)
	c10 = hash(email_address + c6 + c8 + c9 + key + ei)
	c11 = hash(c6 + c8 + c10)


	print "Computing..."
	print "Computation complete"
	print "c6 | " + c6
	print "c7 | " + c7
	print "c8 | " + c8
	print "c9 | " + c9
	print "c10 | " + c10
	print "c11 | " + c11
	print "key | " + key
	print "\n\n"
	
	resp = {
		"c6" : c6,
		"c7" : c7,
		"c8" : c8,
		"c9" : c9,
		"c10" : c10,
		"c11" : c11,
		"key" : key,
	}

	return jsonify(**resp)

if __name__ == "__main__" :
	app.run(debug=True, host="0.0.0.0", threaded=True)

