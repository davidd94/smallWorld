from app import db
from app.api_user import bp
from app.models import Projects
from app.api_user.errors import bad_request
from app.api_user.tokens import get_token
from flask import jsonify, request, current_app
import json


@bp.route('/navbarsearch', methods=['POST'])
def navbar_search():
    search_input = request.json['searchinput']
    page = request.args.get('page', 1, type=int)
    projects, total = Projects.search(search_input,
                                        page,
                                        current_app.config['PROJECTS_PER_PAGE'])
    next_url = url_for('api_user.navbar_search', q=search_input, page=page + 1) \
        if total > page * current_app.config['PROJECTS_PER_PAGE'] else None
    prev_url = url_for('api_user.navbar_search', q=search_input, page=page - 1) \
        if page > 1 else None
    
    searchresults = projects.all()

    all_json_results = []
    for project in searchresults:
        project_result = project.to_dict()
        all_json_results.append(project_result)
    
    if all_json_results:
        return jsonify(all_json_results)
        
    return jsonify('no results')