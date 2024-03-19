from flask import Flask,request,jsonify,make_response,json
from flask_sqlalchemy import SQLAlchemy
import uuid
from werkzeug.security import generate_password_hash,check_password_hash
from flask_cors import CORS
import jwt
import datetime


app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['SECRET_KEY']='abcdrfghj'
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///shop.db'
db=SQLAlchemy(app)

class Onboarding(db.Model):
    Contact=db.Column(db.Integer,primary_key=True)
    MerName=db.Column(db.String(80), nullable=False)
    ShopName=db.Column(db.String(80), nullable=False)
    Line1=db.Column(db.String(100), nullable=False)
    State=db.Column(db.String(100), nullable=False)
    Zip=db.Column(db.Integer, nullable=False)
    Country=db.Column(db.String(100), nullable=False)
    Email=db.Column(db.String(50), unique=True, nullable=False)
    password=db.Column(db.String(80))
    AuthorizeMerchant=db.Column(db.Boolean)


class Products(db.Model):
    product_id=db.Column(db.Integer,primary_key=True)
    Contactid=db.Column(db.Integer)#foreign key to Onboarding.Contact
    Productname=db.Column(db.String(100), nullable=False)
    price=db.Column(db.Integer, nullable=False)
    Quantity=db.Column(db.Integer, nullable=False)
    Exp_Date=db.Column(db.String(100), nullable=False)
    Weight=db.Column(db.Integer, nullable=False)

#This is how we can check DB
#from app import app, db, User
#db.metadata.tables.keys()
#users = User.query.all()
#for user in users:
#    print(user.username, user.email)


@app.route('/merchant',methods=['GET'])
def get_all_merchants():
    merchants=Onboarding.query.all()
    output=[]
    for merchant in merchants:
        merchat_data={}
        merchat_data['contact']=merchant.Contact
        merchat_data['merchant_name']=merchant.MerName
        merchat_data['shop_name']=merchant.ShopName
        merchat_data['line1']=merchant.Line1
        merchat_data['state']=merchant.State
        merchat_data['zip']=merchant.Zip
        merchat_data['country']=merchant.Country
        merchat_data['email']=merchant.Email
        merchat_data['authorize_merchant']=merchant.AuthorizeMerchant
        merchat_data['password']=merchant.password
        output.append(merchat_data)
    return jsonify({'Merchant_List': output})

@app.route('/merchant/<Contact>',methods=['GET'])
def get_single_merchant(Contact):
    
    merchant = Onboarding.query.filter_by(Contact=Contact).first()

    print(merchant)
    if not merchant:
        return jsonify({'message':'No merchant Found!'})
    merchat_data={}
    merchat_data['Contact']=merchant.Contact
    merchat_data['merchant_name']=merchant.MerName
    merchat_data['shop_name']=merchant.ShopName
    merchat_data['line1']=merchant.Line1
    merchat_data['state']=merchant.State
    merchat_data['zip']=merchant.Zip
    merchat_data['country']=merchant.Country
    merchat_data['email']=merchant.Email
    merchat_data['authorize_merchant']=merchant.AuthorizeMerchant

    return jsonify({'Merchant_Details':merchat_data})

@app.route('/merchant',methods=['POST'])
def create_merchant():
#mobile no should be unique
    data = request.get_json()
    #hashed_password = generate_password_hash(data['password'],method='sha256')
    new_merchant=Onboarding(Contact=data['contact'],MerName=data['merchant_name'],ShopName=data['shop_name'],Line1=data['line1'],
    State=data['state'],Zip=data['zip'],Country=data['country'],Email=data['email'],password=data['password'],AuthorizeMerchant=False)
    db.session.add(new_merchant)
    db.session.commit()
    return jsonify({'message':'Congratulations,New Merchant Onboarded!'})
    response = jsonify({'message': 'Success'})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')

@app.route('/login',methods=["POST"])
def login():
    auth = request.get_json()

    #if not auth or not auth.username or not auth.password:
     #   return jsonify({'message':'Invalid Username or Password, Check Again!!'})

    user= Onboarding.query.filter_by(Contact=auth['username']).first()
    #print(type(user.Contact))
    #print(type(user.password))
    #print(type(auth.username))
    #print(type(auth.password))
    if not user:
        return jsonify({'message':'Invalid Username or Password, Check Again!!'})
    elif user.Contact==int(auth['username']) and user.password==auth['password']:
        return jsonify({'username': True})
    else:
        return jsonify({'message':'Invalid Username or Password, Check Again!!'})
    


@app.route('/merchant/<Contact>',methods=["PATCH"])
def update_merchant(Contact):
    merchant = request.get_json()
    merchat_data = Onboarding.query.filter_by(Contact=Contact).first()
    if not merchant:
        return jsonify({'message':'No merchant Found!'})
    if 'contact' in merchant:
        merchat_data.Contact=merchant['contact']
    if 'merchant_name' in merchant:
        merchat_data.MerName=merchant['merchant_name']
    if 'shop_name' in merchant:
        merchat_data.ShopName=merchant['shop_name']
    if 'line1' in merchant:
        merchat_data.Line1=merchant['line1']
    if 'state' in merchant:
        merchat_data.State=merchant['state']
    if 'zip' in merchant:
        merchat_data.Zip=merchant['zip']                
    if 'country' in merchant:
        merchat_data.Country=merchant['country']                
    if 'email' in merchant:
        merchat_data.Email=merchant['email']                
    db.session.commit()
    return jsonify({'message':'Merchant information updated successfully!'})
    response = jsonify({'message': 'Success'})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')

@app.route('/merchant/<Contact>',methods=["PUT"])
def authorize_merchant(Contact):
    merchant = Onboarding.query.filter_by(Contact=Contact).first()
    if not merchant:
        return jsonify({'message':'No merchant Found!'})
    merchant.AuthorizeMerchant=True
    db.session.commit()
    return jsonify({'message':'Congratulations, Merchant is authorized now!'})


@app.route('/merchant/<Contact>',methods=["DELETE"])
def delete_merchant(Contact):
    merchant = Onboarding.query.filter_by(Contact=Contact).first()
    if not merchant:
        return jsonify({'message':'No merchant Found!'})
    db.session.delete(merchant)
    db.session.commit()
    return jsonify({'message':'Merchant Deleted!'})

@app.route('/product/<Contactid>',methods=['POST'])
def add_products(Contactid):
    data = request.get_json()
    new_merchant=Products(Contactid=Contactid,Productname=data['product_name'],price=data['price'],Quantity=data['quantity'],
    Exp_Date=data['exp_date'],Weight=data['weight'])
    db.session.add(new_merchant)
    db.session.commit()
    return jsonify({'message':'Product added Successfully!'})

@app.route('/product/<Contactid>',methods=['GET'])
def get_products(Contactid):
    product=Products.query.filter_by(Contactid=Contactid)
    output=[]
    for p in product:
        product_data={}
        product_data['product_id']=p.product_id
        product_data['contact_id']=p.Contactid
        product_data['product_name']=p.Productname
        product_data['price']=p.price
        product_data['quantity']=p.Quantity
        product_data['exp_date']=p.Exp_Date
        product_data['weight']=p.Weight
        output.append(product_data)
    return jsonify({'Product_List': output})

@app.route('/product/<Contactid>/<product_id>',methods=['GET'])
def get_single_products(Contactid,product_id):
    #product=Products.query.all()
    p = Products.query.filter_by(Contactid=Contactid,product_id=product_id).first()

    product_data={}
    product_data['product_id']=p.product_id
    product_data['contact_id']=p.Contactid
    product_data['product_name']=p.Productname
    product_data['price']=p.price
    product_data['quantity']=p.Quantity
    product_data['exp_date']=p.Exp_Date
    product_data['weight']=p.Weight

    return jsonify({'Product_List ': product_data})

@app.route('/product/<Contactid>/<product_id>',methods=['PATCH','PUT'])
def update_product(Contactid,product_id):
    req_product = request.get_json()
    product_data = Products.query.filter_by(Contactid=Contactid,product_id=product_id).first()
    if not product_data:
        return jsonify({'message':'No Product Found!'})
    if 'product_name' in req_product:
        product_data.Productname=req_product['product_name']
    if 'price' in req_product:
        product_data.price=req_product['price']
    if 'quantity' in req_product:
        product_data.Quantity=req_product['quantity']
    if 'exp_date' in req_product:
        product_data.Exp_Date=req_product['exp_date']            
    if 'weight' in req_product:
        product_data.Weight=req_product['weight']    
    db.session.commit()
    return jsonify({'Product_List ': 'Product Updated Successfully'})



if __name__=='__main__':
    app.run(debug=True)
