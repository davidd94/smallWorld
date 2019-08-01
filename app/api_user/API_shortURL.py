from app import db, cache
from app.api_user import bp
from app.models import AdminBlogPosts
from app.api_user.errors import bad_request
from app.api_user.tokens import get_token, token_auth
from flask import jsonify, request, current_app
import json, requests


@bp.route('/blogurlshortener', methods=['POST'])
def url_shortener():
    blogID = int(request.json['linkid'])
    title = request.json['title']
    destination = request.json['destination']
    
    # CHECKS IF THERE IS ALREADY A URL SAVED IN DB
    blogURL = fetch_url(blogID)
    if blogURL:
        return jsonify(blogURL)

    # CREATES NEW SHORTENED LINK
    shorten_url = url_shortener_request(title, destination)
    if shorten_url:
        blog = AdminBlogPosts.query.get(blogID)
        blog.linkurl = shorten_url
        db.session.commit()
        # CLEARS THE INITIAL 'FALSE' POSITIVE CACHE
        cache.clear()

        return jsonify(shorten_url)

    return jsonify('Failed to shorten link...')


@cache.memoize(timeout=300)
def fetch_url(blogid):
    blog = AdminBlogPosts.query.get(blogid)
    if blog:
        if blog.linkurl:
            return blog.linkurl
    return False


def url_shortener_request(title, url):
    linkRequest = {
        "destination": url,
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
        return link['shortUrl']
    
    return False