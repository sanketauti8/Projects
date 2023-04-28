from pyspark.sql import SparkSession
import seaborn as sns
#s3://hadoop-movie-analysis/Final_Hadoop_project_test.py
# create a SparkSession
#s3://hadoop-movie-analysis/Final_Hadoop_project.py
spark = SparkSession.builder.appName("myApp").getOrCreate()

# read CSV file from S3 bucket
df_movies = spark.read.format("csv").option("header", "true").load("s3://hadoop-movie-analysis/mubi_movie_data.csv")
df_ratings = spark.read.format("csv").option("header", "true").load("s3://hadoop-movie-analysis/mubi_ratings_data.csv")


from io import BytesIO
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
import boto3
s3 = boto3.client('s3')
buffer = BytesIO()
filenames = ['plot1.png', 'plot2.png', 'plot3.png','plot4.png','plot5.png','plot6.png','plot7.png','plot8.png','plot9.png','plot10.png','plot11.png']


# Perform the join operation on 'movie_id'
df_join = df_movies.join(df_ratings, on='movie_id')
from pyspark.sql.types import IntegerType , FloatType

# data filtering
filtered_df = df_join.na.drop()
filtered_df = filtered_df.drop("movie_url", "summary", "movie_image_url", "director_url", "rating_url", "director_id", "rating_url", "rating_timestamp_utc","critic","critic_likes", "critic_comments","user_trialist","user_subscriber","user_eligible_for_trial","user_has_payment_method")
filtered_df = filtered_df.withColumn("movie_id", filtered_df["movie_id"].cast(IntegerType()))
filtered_df = filtered_df.withColumn("rating_score", filtered_df["rating_score"].cast(IntegerType()))
filtered_df = filtered_df.withColumn("movie_popularity", filtered_df["movie_popularity"].cast(IntegerType()))

from pyspark.sql.functions import split, col


# split the "director_name" column by commas and select the first element
filtered_df = filtered_df.withColumn("director_first_name", split(col("director_name"), ",").getItem(0))

# drop the original "director_name" column if needed
filtered_df = filtered_df.drop("director_name")


    # Calculate average rating score per movie title: This will give you the average rating score for each movie title in the DataFrame.

import pyspark.sql.functions as F
df_grouped = filtered_df.groupBy('movie_title').agg({'rating_score': 'mean'})

        # Sort the DataFrame by the average rating score in descending order and select the top 10 rows
df_top_movies = df_grouped.sort(F.col('avg(rating_score)').desc()).limit(10)
        # Convert the PySpark DataFrame to a pandas DataFrame for plotting
df_top_movies_pd = df_top_movies.toPandas()

        # Create a bar chart of the top 10 movies by average rating score
fig1 = plt.figure(figsize=(15, 8))
plt.bar(df_top_movies_pd['movie_title'], df_top_movies_pd['avg(rating_score)'])
plt.xticks(rotation=90)
plt.title('Top 10 movies by average rating score')
plt.xlabel('Movie title')
plt.ylabel('Average rating score')
plt.tight_layout() # Adjust the margins
fig1.savefig('plot1.png', dpi=300)




        # COMMAND ----------

        # Calculate total number of ratings per movie title: This will give you the total number of ratings for each movie title in the DataFrame.
df_grouped = filtered_df.groupBy('movie_title').agg({'rating_score': 'count'})

df_top_movies = df_grouped.sort(F.col('count(rating_score)').desc()).limit(10)

        # Convert the PySpark DataFrame to a pandas DataFrame for plotting
df_top_movies_pd = df_top_movies.toPandas()

        # Create a bar chart of the top 10 movies by number of ratings
fig2 = plt.figure(figsize=(15, 8))
plt.bar(df_top_movies_pd['movie_title'], df_top_movies_pd['count(rating_score)'])
plt.xticks(rotation=90)
plt.title('Top 10 movies by number of ratings')
plt.xlabel('Movie title')
plt.ylabel('Number of ratings')
plt.tight_layout() # Adjust the margins
fig2.savefig('plot2.png',dpi=300)


        # COMMAND ----------

        # Average rating score by movie release year:

from pyspark.sql.functions import avg
avg_rating_by_year = filtered_df.groupBy('movie_release_year').agg(avg('rating_score').alias('avg_rating_score'))
avg_rating_by_year = avg_rating_by_year.orderBy('movie_release_year')

x = avg_rating_by_year.select('movie_release_year').rdd.flatMap(lambda x: x).collect()
y = avg_rating_by_year.select('avg_rating_score').rdd.flatMap(lambda x: x).collect()
fig3 = plt.figure(figsize=(15, 8))
plt.plot(x, y)
plt.xlabel('Movie Release Year')
plt.ylabel('Average Rating Score')
plt.tight_layout()
fig3.savefig('plot3.png',dpi=300)

        # COMMAND ----------

        #Top 10 directors with highest average rating score:
from pyspark.sql.functions import desc

avg_rating_by_director = filtered_df.groupBy('director_first_name').agg(avg('rating_score').alias('avg_rating_score'))
top10_directors = avg_rating_by_director.orderBy(desc('avg_rating_score')).limit(10)

x = top10_directors.select('director_first_name').rdd.flatMap(lambda x: x).collect()
y = top10_directors.select('avg_rating_score').rdd.flatMap(lambda x: x).collect()
        
fig4 = plt.figure(figsize=(15, 8))
plt.bar(x, y)
plt.xticks(rotation=90)  # Rotate x-axis labels by 90 degrees
plt.xlabel('Director Name')
plt.ylabel('Average Rating Score')
plt.tight_layout()
fig4.savefig('plot4.png',dpi=300)
        # COMMAND ----------

        #Distribution of movies by movie popularity
from pyspark.sql.functions import count

movie_count_by_popularity = filtered_df.groupBy('movie_popularity').agg(count('*').alias('movie_count'))

x = movie_count_by_popularity.select(movie_count_by_popularity['movie_popularity']).rdd.flatMap(lambda x: x).collect()
y = movie_count_by_popularity.select('movie_count').rdd.flatMap(lambda x: x).collect()

fig5 = plt.figure(figsize=(15, 8))
plt.hist(x, bins=range(min(x), max(x)+2), weights=y)
plt.xlabel('Movie Popularity')
plt.ylabel('Number of Movies')
plt.tight_layout()
fig5.savefig('plot5.png',dpi=300)


        # COMMAND ----------

avg_rating_by_user = filtered_df.groupBy("user_id").agg(avg("rating_score").alias("avg_rating"))
avg_rating_by_user = avg_rating_by_user.toPandas()
        
fig6 = plt.figure(figsize=(15, 8))
sns.histplot(avg_rating_by_user, x="avg_rating", bins=10)
plt.title("Distribution of Average Rating Given by User")
plt.xlabel("Average Rating")
plt.ylabel("Count")
plt.tight_layout()
fig6.savefig('plot6.png',dpi=300)

        # COMMAND ----------




movie_ratings = filtered_df.groupBy("movie_id", "movie_title").agg(avg("rating_score").alias("avg_rating_score"), count("user_id").alias("num_ratings"))
movie_ratings = movie_ratings.sort(desc("avg_rating_score")).limit(10).toPandas()

        # Plot the bar chart of top rated movies by the users
fig7 = plt.figure(figsize=(15, 8))
sns.barplot(x="avg_rating_score", y="movie_title", data=movie_ratings)
plt.title("Top Movies Rated by Users")
plt.xlabel("Average Rating Score")
plt.ylabel("Movie ID")
plt.xticks(rotation=0)
plt.tight_layout()
fig7.savefig('plot7.png',dpi=300)


        # COMMAND ----------

director_ratings = filtered_df.groupBy("director_first_name").agg(avg("rating_score").alias("avg_rating_score"), count("user_id").alias("num_ratings"))
director_ratings = director_ratings.sort(desc("avg_rating_score")).limit(10).toPandas()

        # Plot the bar chart of top rated directors by the user
fig8 = plt.figure(figsize=(10, 6))
sns.barplot(x="avg_rating_score", y="director_first_name", data=director_ratings)
plt.title("Top Directors Rated by User")
plt.xlabel("Average Rating Score")
plt.ylabel("Director Name")
plt.tight_layout()
fig8.savefig('plot8.png',dpi=300)

        # COMMAND ----------



        # filter dataframe by each rating score
rating_5 = filtered_df.filter("rating_score == 5")
rating_4 = filtered_df.filter("rating_score == 4")
rating_3 = filtered_df.filter("rating_score == 3")

        # count occurrences of each movie title in each rating group
rating_5_count = rating_5.groupBy("movie_title").count().orderBy("count", ascending=False).limit(10)
rating_4_count = rating_4.groupBy("movie_title").count().orderBy("count", ascending=False).limit(10)
rating_3_count = rating_3.groupBy("movie_title").count().orderBy("count", ascending=False).limit(10)

        # plot bar graph for each rating group
fig9 = plt.figure(figsize=(15,5))
plt.subplot(131)
plt.bar(rating_5_count.select("movie_title").rdd.flatMap(lambda x: x).collect(), rating_5_count.select("count").rdd.flatMap(lambda x: x).collect())
plt.xticks(rotation=90)
plt.title("Movies with Most 5 Rating")
plt.subplot(132)
plt.bar(rating_4_count.select("movie_title").rdd.flatMap(lambda x: x).collect(), rating_4_count.select("count").rdd.flatMap(lambda x: x).collect())
plt.xticks(rotation=90)
plt.title("Movies with Most 4 Rating")
plt.subplot(133)
plt.bar(rating_3_count.select("movie_title").rdd.flatMap(lambda x: x).collect(), rating_3_count.select("count").rdd.flatMap(lambda x: x).collect())
plt.xticks(rotation=90)
plt.title("Movies with Most 3 Rating")
plt.tight_layout()

fig9.savefig('plot9.png')
        # COMMAND ----------




movie_ratings = filtered_df.groupBy("movie_id", "movie_title").agg(avg("rating_score").alias("avg_rating_score"), count("user_id").alias("num_ratings"))
movie_ratings = movie_ratings.sort(("avg_rating_score")).limit(10).toPandas()

        # Plot the bar chart of top rated movies by the users
fig10 = plt.figure(figsize=(15,5))
sns.barplot(x="avg_rating_score", y="movie_title", data=movie_ratings)
plt.title("Worst Movies Rated by Users")
plt.xlabel("Average Rating Score")
plt.ylabel("Movie ID")
plt.xticks(rotation=0)
plt.tight_layout()
fig10.savefig('plot10.png',dpi=300)

        # COMMAND ----------

director_ratings = filtered_df.groupBy("director_first_name").agg(avg("rating_score").alias("avg_rating_score"), count("user_id").alias("num_ratings"))
director_ratings = director_ratings.sort(("avg_rating_score")).limit(10).toPandas()

        # Plot the bar chart of top rated directors by the user
fig11 = plt.figure(figsize=(15,5))
sns.barplot(x="avg_rating_score", y="director_first_name", data=director_ratings)
plt.title("Worst Directors Rated by User")
plt.xlabel("Average Rating Score")
plt.ylabel("Director Name")
plt.tight_layout()
fig11.savefig('plot11.png',dpi=300)

for filename in filenames:
    with open(filename, 'rb') as file:
        s3.upload_fileobj(file, 'hadoop-movie-analysis', filename)





