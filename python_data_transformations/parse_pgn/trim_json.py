from audioop import reverse
import chess.pgn
from time import perf_counter
from tqdm import tqdm
import json



# Function to sort hte list by second item of tuple
def Sort_Tuple(tup): 
    # https://www.geeksforgeeks.org/python-program-to-sort-a-list-of-tuples-by-second-item/
    # reverse = None (Sorts in Ascending order) 
    # key is set to sort using second element of 
    # sublist lambda has been used 
    tup.sort(key = lambda x: x[1], reverse=True) 
    return tup 

def count_other(arr):
    """ counts the other items """
    cnt = 0
    for fen, (cnt, moveSrt) in arr:
        cnt += cnt
    return cnt

# top 10

def filter_top_k(k, data):
    """ filter the top k next moves, put others into an "other" category """
    for level, fens in tqdm(data.items()):
        for fen, d in fens.items():
            nxtArr = list(d['nxt'].items())  # [(fen, count), ...]
            sortedArr = Sort_Tuple(nxtArr)
            data[level][fen]['nxt'] = sortedArr[:k]

            if (len(sortedArr) > k):
                other_cnt = count_other(sortedArr[k:])
                data[level][fen]['nxt'].append(
                    ["Other", other_cnt]
                )
    return data


if __name__ == "__main__":
    # filter to only show top 10 next moves and save
    input_filename = "backup_2022_26000000.json" # "2020-01.pgn"
    game_count_million = 26

    with open(input_filename, "r") as f:
        data = json.load(f)
    games_actual = 2  # only used in output filename

    filtered_data = filter_top_k(10, data)

    filename = "v2_filt10_"+str(game_count_million)+"M.json"
    print("saving to file: " + filename)
    with open(filename, "w") as write_file:
        json.dump(filtered_data, write_file) #, indent=2)


