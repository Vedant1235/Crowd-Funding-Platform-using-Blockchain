from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import difflib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
@app.route('/', methods=["POST"])
@cross_origin()
def about():
    data = request.json
    movies = pd.DataFrame(data["dataset"])
    movies['index'] = range(1, len(movies) + 1)
    
    selfeatures=['title','description','category']
    combined_features=''
    for feature in selfeatures:
        movies[feature]=movies[feature].fillna('')
        combined_features+=movies[feature]+' '
    vectorizer=TfidfVectorizer()
    feature_vector=vectorizer.fit_transform(combined_features)

    similarity=cosine_similarity(feature_vector)

    movie_name=data["dataset"][data["pId"]]["title"]
    listOfAll=movies['title'].tolist()
    find_close_match=difflib.get_close_matches(movie_name,listOfAll)
    cm=find_close_match[0]
    ind=movies[movies.title==cm]['index'].values[0]
    similarity_score=sorted(list(enumerate(similarity[ind-1])),key=lambda x:x[1],reverse=True)
    mylist=[]
    i=1
    for movie in similarity_score:
        index=movie[0]
        title=movies[movies.index==index]['pId'].values[0]
        print(title)
        
        if(i<5):
            if(title!=data["pId"]):
                mylist.append(data["dataset"][title])
                i+=1
    print(mylist)
    return jsonify(mylist)
if __name__ == '__main__':
    app.run(debug=True, port=8090)
