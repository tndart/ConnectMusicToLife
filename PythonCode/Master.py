from subprocess import check_output
import re
import pandas as pd

out_put = check_output(["python","/usr/musicrecommender/svd-recommendation.py", "206", "10"])
out_put = out_put.replace('u','')
out_put = out_put.replace("\n",'')
out_put = out_put.replace('[','')
out_put = out_put.replace("]",'')
out_put = out_put.replace('(','')
out_put = out_put.replace(")",'')
out_put = out_put.replace("'",'')

list = re.split(", ", out_put)
return_df = pd.DataFrame(list)
