from app import db
from app.api_user import bp
from app.api_user.errors import bad_request
from app.api_user.tokens import get_token, token_auth
from flask import jsonify, request, current_app
import json, requests


@bp.route('/urlshortener', methods=['POST'])
def url_shortener():
    title = request.json['title']
    destination = request.json['destination']
    linkRequest = {
        "destination": destination,
        "domain": { "fullName": "rebrand.ly" },
        "title": title,
        # "slashtag": "A_NEW_SLASHTAG"
    }

    requestHeaders = {
        "Content-Type": "application/json",
        "apikey": current_app.config['REBRANDLY_KEY']
    }

    r = requests.post("https://api.rebrandly.com/v1/links",
                        data=json.dumps(linkRequest),
                        headers=requestHeaders)
    
    if (r.status_code == requests.codes.ok):
        link = r.json()
        print(link['destination'])
        print(link['shortUrl'])
        return jsonify(link['shortUrl'])

    return jsonify('Failed to shorten link...')

