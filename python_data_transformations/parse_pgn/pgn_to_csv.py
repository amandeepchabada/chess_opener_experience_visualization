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
    """ returns array of fens for first x+1 moves """

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


def is_game_invalid(game):
    """ returns true if all checks passed """

    if not game: return True  # if falsy
    elo = game.headers['WhiteElo'] and game.headers['BlackElo']
    time = len(game.headers['TimeControl']) <= 4  # true if over 100 seconds or more than 10s increment

    return time and elo


def add_fen_data(headers, fen, exp, next_uci):
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
        if next_uci in data[exp][fen]['nxt']:
            data[exp][fen]['nxt'][next_uci] += 1
        else:
            data[exp][fen]['nxt'][next_uci] = 1

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
                next_uci: 1
            }
        }


# main code
start = perf_counter()
invalid_games = 0
games = 100_000_000
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
    fens, ucis = extract_fens_uci(game)
    for i, fen in enumerate(fens):
        if len(ucis) == i+1: break
        add_fen_data(game.headers, fen, exp, ucis[i+1])

    # backup current data
    if games_actual % 100_000 == 0:
        filename = f'backup_2022_{str(games_actual)}.json'
        with open(filename, "w") as wf:
            json.dump(data, wf)


end = perf_counter()
print('time:', end-start)
print('invalid games', invalid_games)
print('valid games', games - invalid_games)
filename = "v1_{:e}.json".format(games_actual)
with open(filename, "w") as write_file:
    json.dump(data, write_file, indent=2)
# print(data)