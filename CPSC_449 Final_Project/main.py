#uvicorn main:app --reload
from fastapi import FastAPI, Response, status, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
import json
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection
from pymongo import IndexModel, ASCENDING
from bson import ObjectId


app = FastAPI()

client: AsyncIOMotorClient = None
collection: AsyncIOMotorCollection = None


class BookStore(BaseModel):
    title: str
    author: str
    description: str
    price: int
    stock: int


@app.on_event("startup")
async def startup():
    global client, collection
    client = AsyncIOMotorClient("mongodb://localhost:27017/")  # Replace with your MongoDB connection string
    db = client["Bookdatabase"]  # Replace with the name of your MongoDB database
    collection = db["Book"]  # Replace with the name of your MongoDB collection
    await client.start_session()

    # Create indexes
    await collection.create_indexes([IndexModel("title"), IndexModel([("author", ASCENDING), ("title", ASCENDING)])])


@app.on_event("shutdown")
async def shutdown():
    await client.end_session()
    client.close()

#error handling
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return Response(
        content=json.dumps({"detail": exc.detail}),
        media_type="application/json",
        status_code=exc.status_code
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    return Response(
        content=json.dumps({"detail": "Internal server error"}),
        media_type="application/json",
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
    )

#Endpoints
@app.get("/books")
async def get_all_book():
    records = []
    async for record in collection.find():
        records.append({
            "id": str(record["_id"]),
            "title": record["title"],
            "author": record["author"],
            "description": record["description"],
            "price": record["price"],
            "stock": record["stock"]
        })
    return records


@app.get("/books/{_id}")
async def get_book(_id: str):
    book_id = ObjectId(_id)
    record = await collection.find_one({"_id": book_id})
    if record:
        return {
            "id": str(record["_id"]),
            "title": record["title"],
            "author": record["author"],
            "description": record["description"],
            "price": record["price"],
            "stock": record["stock"]
        }
    else:
        return Response(content=json.dumps("User not found"), media_type="application/json",
                        status_code=status.HTTP_404_NOT_FOUND)


@app.delete("/books/{_id}")
async def deleteBook(_id: str):
    _id = ObjectId(_id)
    result = await collection.delete_one({"_id": _id})
    if result.deleted_count == 1:
        return {"message": f"Book with ID {_id} deleted successfully"}
    else:
        return {"message": f"Book with ID {_id} not found"}


@app.post("/books")
async def create_book(input_data: BookStore):
    record_dict = {
        "title": input_data.title,
        "author": input_data.author,
        "description": input_data.description,
        "price": input_data.price,
        "stock": input_data.stock
    }
    await collection.insert_one(record_dict)
    return Response(content=json.dumps("New Book added!!"), media_type="application/json",
                    status_code=status.HTTP_201_CREATED)





@app.get("/search", response_model=dict[str, list[BookStore]])
async def search_book(title: Optional[str] = None, author: Optional[str] = None,
                      min_price: Optional[float] = None, max_price: Optional[float] = None):
    query = {}
    if title:
        query["title"] = {"$regex": title, "$options": "i"}
    if author:
        query["author"] = {"$regex": author, "$options": "i"}
    if min_price:
        query["price"] = {"$gte": min_price}
    if max_price:
        query["price"] = {"$lte": max_price}

    records = await collection.find(query).to_list(length=None)

    books = []
    for record in records:
        books.append({
            "id": str(record["_id"]),
            "title": record["title"],
            "author": record["author"],
            "description": record["description"],
            "price": record["price"],
            "stock": record["stock"]
        })

    return {"books": books}



@app.put("/books/{_id}")
async def updateBook(_id: str, input_data: Optional [BookStore]):
    _id = ObjectId(_id)
    result = await collection.find_one({"_id": _id})
    if result:
        update_data = {}
        if input_data.title:
            update_data["title"] = input_data.title
        if input_data.author:
            update_data["author"] = input_data.author
        if input_data.description:
            update_data["description"] = input_data.description
        if input_data.price:
            update_data["price"] = input_data.price
        if input_data.stock:
            update_data["stock"] = input_data.stock

        await collection.update_one({"_id": _id}, {"$set": update_data})
        return {"message": f"Book with ID {_id} updated successfully."}
    else:
        return {"message": f"Book with ID {_id} not found."}


#Aggr Function endpoints

@app.get("/books/aggr/count")
async def get_total_book_count():
    pipeline = [
        {"$count": "totalBooks"}
    ]

    result = await collection.aggregate(pipeline).to_list(length=None)
    total_books = result[0]['totalBooks'] if result else 0

    return {"totalBooks": total_books}


@app.get("/books/aggr/bestsellers", response_model=list[BookStore])
async def get_top_5_bestsellers():
    pipeline = [
        {"$sort": {"stock": -1}},
        {"$limit": 5}
    ]

    result = await collection.aggregate(pipeline).to_list(length=None)

    return result

@app.get("/authors/aggr/top")
async def get_top_5_authors_with_most_books():
    pipeline = [
        {"$group": {"_id": "$author", "totalBooks": {"$sum": 1}}},
        {"$sort": {"totalBooks": -1}},
        {"$limit": 5}
    ]

    result = await collection.aggregate(pipeline).to_list(length=None)

    return {"topAuthors": result}