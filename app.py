# -*- coding: utf-8 -*-
"""
Simple flask based application
"""

import sqlite3
# import Flask class from flask module
from flask import (Flask, render_template, 
                   request, redirect, url_for)


# app is instance of Flask class
print(__name__)
app = Flask(__name__)


def get_connection():
    return sqlite3.connect('db.sqlite3')


def init_db():
    db_conn = get_connection()
    cur = db_conn.cursor()
    _sql = '''SELECT name FROM sqlite_master
    WHERE type='table' AND name='peoples'
    '''
    cur.execute(_sql)
    if not cur.fetchone():
        _create_sql = '''CREATE TABLE
peoples(id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT NOT NULL,
        lastname TEXT NULL,
        address TEXT NULL,
        country TEXT NULL)'''
        cur.execute(_create_sql)
        db_conn.commit()


# makes this function root path of our application
@app.route('/')
def index():
    """
    index page of our web app

        - Open http://localhost:5000 on browser
    """
    return render_template('home.jinja2')


@app.route('/add', methods=['GET', 'POST'])
def add_people():
    """
    add new people
    """
    print('*'*5, request.method)
    if request.method == 'POST':
        db_conn = get_connection()
        cur = db_conn.cursor()
        # save data to database
        # redirect to list page
        print('>'*5, request.form)
        firstname = request.form['firstname']
        lastname = request.form['lastname']
        address = request.form['address']
        country = request.form['country']

        if firstname.strip():
            # save to db
            _sql = '''INSERT INTO peoples(
firstname, lastname, address, country)
VALUES(?, ?, ?, ?)'''
            cur.execute(_sql, (
                firstname.strip(),
                lastname.strip(),
                address.strip(),
                country.strip()
            ))
            db_conn.commit()
            return redirect(url_for('list_people'))
    return render_template('add.jinja2')


@app.route('/list')
def list_people():
    """
    list all peoples
    """
    db_conn = get_connection()
    cur = db_conn.cursor()
    _sql = """SELECT 
    id, firstname, lastname, address, country 
    FROM peoples"""
    cur.execute(_sql)
    records = cur.fetchall()
    return render_template('list.jinja2',
                           data=records)


@app.route('/update/<int:pid>')
def update_people(pid):
    """
    should update any people by given id
    select * from peoples where id=pid
    update peoples set firstname=?, lastname=?
        address=?, country=? where id=pid
    """
    pass


# @app.route('/hello/<name>')
# @app.route('/hello')
# def hello(name):
#     """
#     hellos back to user
#     """
#     return "Hello {}!".format(name)


# @app.route('/details/<int:user_id>')
# def user_details(user_id):
#     """
#     return user detail for given user
#     """
#     return "{FullName} {Age} {Location}".format(**{
#         'FullName': 'John Doe',
#         'Age': 'Unknown',
#         'Location': 'Kathmandu'
#     })


if __name__ == '__main__':
    # only when __name__ is __main__
    init_db()
    app.run(debug=True)
