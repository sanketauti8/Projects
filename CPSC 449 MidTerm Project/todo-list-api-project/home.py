
from flask import Flask, request,jsonify,make_response,render_template,redirect
import jwt
import uuid
from flask_uploads import UploadSet, configure_uploads, IMAGES, DOCUMENTS
from werkzeug.utils import secure_filename

from werkzeug.security import generate_password_hash,check_password_hash
from flask_sqlalchemy import SQLAlchemy
import datetime
from functools import wraps

app=Flask(__name__)

app.config['SECRET_KEY']='thisissecret'
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///todo1.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db=SQLAlchemy(app)

app.config['UPLOADED_PHOTOS_DEST'] = 'uploads/photos'
app.config['UPLOADED_PDFS_DEST'] = 'uploads/pdfs'
app.config['ALLOWED_EXTENSIONS'] = set(['png', 'jpg', 'jpeg', 'gif', 'pdf','txt'])

photos = UploadSet('photos', IMAGES)
documents = UploadSet('pdfs', ('pdf','txt'))

configure_uploads(app, (photos, documents))


class User(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    public_id=db.Column(db.String(50),unique=True)
    name=db.Column(db.String(50))
    password=db.Column(db.String(80))
    admin=db.Column(db.Boolean)

class Todo(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    text = db.Column(db.String(50))
    complete=db.Column(db.Boolean)
    user_id=db.Column(db.Integer)

#below command used to create tables for DB
#with app.app_context():
#    db.create_all()


#Error handling 

@app.errorhandler(Exception)
def handle_error(e):
    return render_template('error.html', error=str(e)), 500

@app.errorhandler(400)
def bad_request_error(error):
    return render_template('400.html'), 400

@app.errorhandler(401)
def unauthorized_error(error):
    return render_template('401.html'), 401

@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(error):
    return render_template('500.html'), 500

#token verification
def token_required(f):
    @wraps(f)
    def decorated(*args,**kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message':'Token is missing!'}), 401      
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user=User.query.filter_by(public_id=data['public_id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}),401    

        return f(current_user,*args,**kwargs)
    return decorated

#endpoints

#public route

@app.route('/user',methods=['GET'])
def get_all_users():
    users=User.query.all()
    output=[]

    for user in users:
        user_data={}
        user_data['public_id']=user.public_id
        user_data['name']=user.name
        user_data['password']=user.password
        user_data['admin']=user.admin
        output.append(user_data)
    return jsonify({'users':output})


@app.route('/user/<public_id>',methods=['GET'])
@token_required
def get_one_user(current_user,public_id):
    if not current_user.admin:
        return jsonify({'message':'Only Admin can perform this function!'})

    user=User.query.filter_by(public_id=public_id).first()
    
    if not user:
        return jsonify({'message':'No user Found!'})
    user_data={}
    user_data['public_id']=user.public_id
    user_data['name']=user.name
    user_data['password']=user.password
    user_data['admin']=user.admin
        
    return jsonify({'user':user_data})

#public route
@app.route('/user',methods=['POST'])
def create_user():
    data=request.get_json()
    print(data)
    hashed_password = generate_password_hash(data['password'],method='sha256')
    new_user=User(public_id=str(uuid.uuid4()), name=data['name'],password=hashed_password,admin=False)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message':'New user created!'})

@app.route('/user/<public_id>',methods=['PUT','PATCH'])
@token_required
def promote_user(current_user,public_id):
    if not current_user.admin:
        return jsonify({'message':'Only Admin can perform this function!'})

    user=User.query.filter_by(public_id=public_id).first()
    
    if not user:
        return jsonify({'message':'No user Found!'})
    user.admin=True
    db.session.commit()    
    return jsonify({'message':'User has been promoted!'})
    

@app.route('/user/<public_id>',methods=['DELETE'])
@token_required
def delete_user(current_user,public_id):
    if not current_user.admin:
        return jsonify({'message':'Only Admin can perform this function!'})

    user=User.query.filter_by(public_id=public_id).first()
    
    if not user:
        return jsonify({'message':'No user Found!'})
    
    db.session.delete(user)  
    db.session.commit()
    return jsonify({'message':'User has been deleted!'})

#jwt token generation
@app.route('/login',methods=["GET","POST"])
def login():
    auth = request.authorization
    print(auth)

    if not auth or not auth.username or not auth.password:
        return make_response('Could not verify1',401,{'WWW-Authenticate':'Basic realm="Login required!"'})

    user= User.query.filter_by(name=auth.username).first()
    print(user)
    if not user:
        return make_response('Could not verify2',401,{'WWW-Authenticate':'Basic realm="Login required!"'})

    if check_password_hash(user.password, auth.password):
        token = jwt.encode({'public_id': user.public_id,'exp': datetime.datetime.utcnow()+datetime.timedelta(minutes=30)},app.config['SECRET_KEY'],algorithm="HS256")
        #data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        return jsonify({'token':token})
    
    return make_response('Could not verify3',401,{'WWW-Authenticate':'Basic realm="Login required!"'})

#todo apis
@app.route('/todo',methods=['GET'])
@token_required
def get_all_todos(current_user):

    todos=Todo.query.filter_by(user_id=current_user.id).all()
    output=[]

    for todo in todos:
        todo_data={}
        todo_data['id']=todo.id
        todo_data['text']=todo.text
        todo_data['complete']=todo.complete
        output.append(todo_data)
    return jsonify({'todos':output}) 

@app.route('/todo/<todo_id>',methods=['GET'])
@token_required
def get_one_todo(current_user,todo_id):
    todo=Todo.query.filter_by(id=todo_id,user_id=current_user.id).first()
    if not todo:
        return jsonify({'message' : 'No todo found!'})
    todo_data={}
    todo_data['id']=todo.id
    todo_data['text']=todo.text
    todo_data['complete']=todo.complete
    return jsonify({'todo':todo_data})

@app.route('/todo',methods=['POST'])
@token_required
def create_todo(current_user):
    data=request.get_json()

    new_todo=Todo(text=data['text'],complete=False,user_id=current_user.id)
    db.session.add(new_todo)
    db.session.commit()

    return jsonify({'message':'Todo Created!'})

@app.route('/todo/<todo_id>',methods=['PUT'])
@token_required
def complete_todo(current_user,todo_id):
    todo=Todo.query.filter_by(id=todo_id,user_id=current_user.id).first()
    if not todo:
        return jsonify({'message' : 'No todo found!'})
    
    todo.complete=True
    db.session.commit()
    return jsonify({'Message':"Todo item Completed!"})
    

@app.route('/todo/<todo_id>',methods=['DELETE'])
@token_required
def delete_todo(current_user,todo_id):
    todo=Todo.query.filter_by(id=todo_id,user_id=current_user.id).first()
    if not todo:
        return jsonify({'message' : 'No todo found!'})
    
    db.session.delete(todo)
    db.session.commit()
    return jsonify({'Message':"Todo item Deleted!"})
    

#upload a document logic

@app.route("/uploadindex")
def uploadindex():
    return render_template("upload.html")

@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST' and 'photo' in request.files:
        photo = request.files['photo']
        if '.' in photo.filename and \
           photo.filename.rsplit('.', 1)[1].lower() in {'jpg', 'jpeg', 'png', 'gif'}:
            filename = photos.save(photo)
            return 'File uploaded successfully as {}'.format(filename)
        elif '.' in photo.filename and \
             photo.filename.rsplit('.', 1)[1].lower() in {'pdf','txt'}:
            filename = documents.save(photo)
            return 'PDF uploaded successfully as {}'.format(filename)
        else:
            return 'Invalid file type'
    return 'Error uploading file'


#main method

if __name__=='__main__':
    app.run(debug=True)






