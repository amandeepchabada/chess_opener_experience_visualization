from audioop import reverse
import chess.pgn
from time import perf_counter
from tqdm import tqdm
import json

data = {
    0: {}, # beginner
    1: {}, # intermediate
    2: {}, # advanced
    3: {}, # expert
}

input_filename = "2022-01.pgn" # "2020-01.pgn"
pgn = open(input_filename)

def classify_game(black, white):
    """ classify game based on black and white elo 
    
    may return false
    will return 0-beginner, 1-intermediate, 2-advanced, 3-expert
    """
    black = int(black)
    white = int(white)

    if black < 500 or white < 500:
        return False

    avg = (black + white) / 2
    if avg < 1200:
        return 0
    if avg < 1800:
        return 1
    if avg < 2200:
        return 2
    return 3

def extract_fens_uci(game, x=5):
    """ returns array of fens for first x+1 moves, not including first one """

    fens = []
    ucis = []
    board = game.board()
    for i, move in enumerate(game.mainline_moves()):
        if i > x:
            uci = move.uci()
            ucis.append(uci)
            break
        board.push(move)
        fen = board.fen()
        fens.append(fen)
        uci = move.uci()
        ucis.append(uci)
    return fens, ucis



def extract_fens(game, x=5):
    """ returns array of fens for first x+1 moves, including first one """

    fens = []
    board = game.board()
    for i, move in enumerate(game.mainline_moves()):
        fen = board.fen()
        fens.append(fen)
        if i > x: break
        board.push(move)

    return fens

def extract_fens_moveStrs(game, x=5):
    """ returns array of fens for first x+1 moves, including first one """

    fens = []
    moveStrs = []
    board = game.board()
    for i, move in enumerate(game.mainline_moves()):
        fen = board.fen()
        fens.append(fen)
        moveStrs.append(board.san(move))
        if i > x: break
        board.push(move)

    return fens, moveStrs


def is_game_invalid(game):
    """ returns true if all checks passed """

    if not game: return True  # if falsy
    elo = game.headers['WhiteElo'] and game.headers['BlackElo']
    time = len(game.headers['TimeControl']) <= 4  # true if over 100 seconds or more than 10s increment

    return time and elo


def add_fen_data(headers, fen, exp, next_fen, moveStr):
    """ add games to data object """

    # update fen data
    if fen in data[exp]:
        if headers['Result'] == '1-0':
            res = 'w'
        elif headers['Result'] == '0-1':
            res = 'b'
        elif headers['Result'] == '1/2-1/2':
            res = 't'
        else:
            print('Result header not recognized:' + headers['Result'])
            return

        # update result count
        data[exp][fen][res] += 1
        # add next move
        if next_fen in data[exp][fen]['nxt']:
            data[exp][fen]['nxt'][next_fen][0] += 1
        else:
            data[exp][fen]['nxt'][next_fen] = [1, moveStr]

    # add new fen
    else:
        wht = 1 if headers['Result'] == '1-0' else 0
        blk = 1 if headers['Result'] == '0-1' else 0
        tie = 1 if headers['Result'] == '1/2-1/2' else 0

        data[exp][fen] = {
            'b': blk,  # white win count
            'w': wht,  # black win count
            't': tie,  # tie count
            'nxt': {  # next move count
                next_fen: [1, moveStr]
            }
        }


# main code
start = perf_counter()
invalid_games = 0
games = 2_000_000 #2_000_000 #10_000 # 2_000_000 #1_000_000
backup_every = 100_000
backup_games = False
games_actual = 0

for i in tqdm(range(games)):
    # check game validity
    game = chess.pgn.read_game(pgn)
    if is_game_invalid(game):
        invalid_games += 1
        continue
    games_actual += 1

    # parse game and update
    exp = classify_game(game.headers['WhiteElo'], game.headers['BlackElo'])
    fens, moveStrs = extract_fens_moveStrs(game)
    for i, fen in enumerate(fens):
        if len(fens) == i+1: break
        add_fen_data(game.headers, fen, exp, fens[i+1], moveStrs[i])

    # backup current data
    if backup_games and games_actual % backup_every == 0:
        filename = f'backup_2022_{str(games_actual)}.json'
        with open(filename, "w") as wf:
            json.dump(data, wf)

# save full df to json
end = perf_counter()
print('time:', end-start)
print('invalid games', invalid_games)
print('valid games', games - invalid_games)
filename = "v2_{:e}.json".format(games_actual)
with open(filename, "w") as write_file:
    json.dump(data, write_file, indent=2)

# filter to only show top 10 next moves and save

# Function to sort hte list by second item of tuple
def Sort_Tuple(tup): 
    # https://www.geeksforgeeks.org/python-program-to-sort-a-list-of-tuples-by-second-item/
    # reverse = None (Sorts in Ascending order) 
    # key is set to sort using second element of 
    # sublist lambda has been used 
    tup.sort(key = lambda x: x[1], reverse=True) 
    return tup 

# top 10
for level, fens in data.items():
    for fen, d in fens.items():
        nxtArr = list(d['nxt'].items())  # [(fen, count), ...]
        sortedArr = Sort_Tuple(nxtArr)
        data[level][fen]['nxt'] = sortedArr[:10]

filename = "v2_filt10_{:e}.json".format(games_actual)
with open(filename, "w") as write_file:
    json.dump(data, write_file) #, indent=2)

# top 5
for level, fens in data.items():
    for fen, d in fens.items():
        data[level][fen]['nxt'] = d['nxt'][:5]

filename = "v2_filt5_{:e}.json".format(games_actual)
with open(filename, "w") as write_file:
    json.dump(data, write_file) #, indent=2)

# print(data)