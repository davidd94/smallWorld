from app import db
from app.api_user import bp
from app.api_user.errors import bad_request
from app.api_user.tokens import get_token, token_auth
from flask import jsonify, request, current_app
import json
import tweepy


def Authentication():
    config = current_app.config
    try:
        auth = tweepy.OAuthHandler(config['TWITTER_KEY'], config['TWITTER_SECRET_KEY'])
        auth.set_access_token(config['TWITTER_ACCESS_TOKEN'], config['TWITTER_ACCESS_SECRET_TOKEN'])
        return auth
    except Exception as e:
        return None

@bp.route('/twitter/tweet', methods=['POST'])
def twitter_tweet():
    tweet = request.json['tweet']
    auth = Authentication()
    if auth:
        api = tweepy.API(auth)     
        api.update_status(tweet)
        return jsonify('Tweet successfully posted!')
    return jsonify('Failed to tweet...')