from collections import defaultdict

from surprise import SVD
from surprise import Dataset

import pandas as pd
import numpy as np

# First train an SVD algorithm on the movielens dataset.
data = Dataset.load_builtin('ml-100k')
trainset = data.build_full_trainset()
algo = SVD()
algo.fit(trainset)

# Than predict ratings for all pairs (u, i) that are NOT in the training set.
testset = trainset.build_anti_testset()
predictions = algo.test(testset)

def get_top_n(predictions,userid ,n=10):
    '''Return the top-N recommendation for each user from a set of predictions.

    Args:
        predictions(list of Prediction objects): The list of predictions, as
            returned by the test method of an algorithm.
        n(int): The number of recommendation to output for each user. Default
            is 10.

    Returns:
    A dict where keys are user (raw) ids and values are lists of tuples:
        [(raw item id, rating estimation), ...] of size n.
    '''

    # First map the predictions to each user.
    top_n = defaultdict(list)
    for uid,iid, true_r, est, _ in predictions:
        if (uid == userid):
            top_n[uid].append((iid, est))

    # Then sort the predictions for each user and retrieve the k highest ones.
    for uid, user_ratings in top_n.items():
        if (uid == userid):
            user_ratings.sort(key=lambda x: x[1], reverse=True)
            top_n[uid] = user_ratings[:n]

    return top_n

top_n = get_top_n(predictions,userid=str(sys.argv[1]),n=int(sys.argv[2]))
  
# Print the recommended items for user
for uid, user_ratings in top_n.items():
    print(uid, [iid for (iid, _) in user_ratings])
