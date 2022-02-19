

from functools import reduce
import json
import io
import chess

tree = {}
openings = set()
with open('tree-with-moves.json') as f:
    tree = json.load(f)

# output will be tuple (eco, human-readible name, pgn, fen)
visited = set()
frontier = [tree]

def movesToFen(pgn_string):
    pgn = io.StringIO(pgn_string)
    game = chess.pgn.read_game(pgn)
    if game.errors:
        print('errors while parsing fen:' , game.errors)
        return 'err'

    board = game.board()
    for move in game.mainline_moves():
        board.push(move)
    return board.fen()



while len(frontier):
    subtree = frontier.pop()
    new_items = set([
        (key, (val['name'], val['moves'], movesToFen(val['moves']))) 
        for key, val in subtree.items() 
        if not '-' in key and key != 'name' and key != 'moves'
    ])
    new_frontier = [val for (key, val) in subtree.items() if '-' in key]
    visited |= new_items
    frontier += new_frontier

tuple_list = list(visited)  # array of tuples (eco, human-readible name, pgn, fen) 
eco_indexed = dict(tuple_list)
pgn_indexed = dict(
        reduce(  # need to reorder items
            lambda output, tup: output + [(tup[1][1], (tup[0], tup[1][0], tup[1][2]))],
            tuple_list, []
    )
)
fen_indexed = dict(
        reduce(  # need to reorder items
            lambda output, tup: output + [(tup[1][2], (tup[0], tup[1][0], tup[1][1]))],
            tuple_list, []
    )
)

with open('eco_indexed.json', 'w') as outfile:
    outfile.write(json.dumps(eco_indexed, indent=4))
with open('pgn_indexed.json', 'w') as outfile:
    outfile.write(json.dumps(pgn_indexed, indent=4))
with open('fen_indexed.json', 'w') as outfile:
    outfile.write(json.dumps(fen_indexed, indent=4))