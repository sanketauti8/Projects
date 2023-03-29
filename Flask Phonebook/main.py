#Working code phonebook

from flask import Flask
from flask_restful import Api,Resource,reqparse,abort,marshal_with,fields
import datetime
from flask_sqlalchemy import SQLAlchemy


app=Flask(__name__)
api=Api(app)
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///phonebook.db'
db=SQLAlchemy(app)


class PhonebookModel(db.Model):
    phoneno=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String,nullable=False)
    address=db.Column(db.String,nullable=False)
    pin=db.Column(db.Integer,nullable=False)
    state=db.Column(db.String,nullable=False)
    country=db.Column(db.String,nullable=False)
    ssn=db.Column(db.Integer,nullable=False)
    

    def __repr__(self):
        return f"Phonebook(phoneno={phoneno},name={name},address={address},pin={pin},state={state},country={country},ssn={ssn})"

#db.create_all()


Phoneno_put = reqparse.RequestParser()
#Phoneno_put.add_argument("phoneno",type=int,help="Mobile No required",required=True)
Phoneno_put.add_argument("name",type=str,help="Name required",required=True)
Phoneno_put.add_argument("address",type=str,help="address required",required=True)
Phoneno_put.add_argument("pin",type=int,help="Pin required",required=True)
Phoneno_put.add_argument("state",type=str,help="State required",required=True)
Phoneno_put.add_argument("country",type=str,help="Country required",required=True)
Phoneno_put.add_argument("ssn",type=int,help="SSN required",required=True)

phoneno_update = reqparse.RequestParser()
phoneno_update.add_argument("name",type=str,help="Name required")
phoneno_update.add_argument("address",type=str,help="address required")
phoneno_update.add_argument("pin",type=int,help="Pin required")
phoneno_update.add_argument("state",type=str,help="State required")
phoneno_update.add_argument("country",type=str,help="Country required")
phoneno_update.add_argument("ssn",type=int,help="SSN required")


resource_fields={
    'phoneno':fields.Integer,
    'name':fields.String,
    'address':fields.String,
    'pin':fields.Integer,
    'state':fields.String,
    'country':fields.String,
    'ssn':fields.Integer
}




class Phonebook(Resource):
    @marshal_with(resource_fields)
    def get(self,phoneno):
        result=PhonebookModel.query.filter_by(phoneno=phoneno).first()
        if not result:
            abort(404,message="No Record Found..!!")
        return result

    @marshal_with(resource_fields)
    def post(self,phoneno):
        args=Phoneno_put.parse_args()
        #args.mobileno=phoneno
        #recoredCreated =  str(datetime.datetime.now())
        result = PhonebookModel.query.filter_by(phoneno=phoneno).first()
        if result:
            abort(409,message="Phone no already Taken..")
        pb=PhonebookModel(phoneno=phoneno,name=args['name'],address=args['address'],pin=args['pin'],state=args['state'],country=args['country'],ssn=args['ssn'])
        db.session.add(pb)
        db.session.commit()
        return pb,201

    @marshal_with(resource_fields)
    def delete(self,phoneno):
        phoneno=phoneno
        result=PhonebookModel.query.filter_by(phoneno=phoneno).first()
        if not result:
            abort(404,message="Recored not found..!")
        db.session.delete(result)
        db.session.commit()
        return abort(404,message="Record deleted")

    @marshal_with(resource_fields)
    def patch(self,phoneno):
        args=phoneno_update.parse_args()
        result=PhonebookModel.query.filter_by(phoneno=phoneno).first()
        
        if args['pin']:
            result.pin=args['pin']
        if args['state']:
            result.state=args['state']
        if args['country']:
            result.country=args['country']                    
        if args['ssn']:
            result.ssn=args['ssn']

        db.session.commit()
        return result    


api.add_resource(Phonebook,"/pb/<int:phoneno>")

if __name__ == "__main__":
    app.run(debug=True)
