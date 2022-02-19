# Files

- pgn_to_csv.py: the parsing code. Uses the python [chess library](https://python-chess.readthedocs.io/) to do a lot of the heavy lifting 

- ...json: files for parsed games. A number indicating how many games were roughly parsed should be in the filename

- ...pgn: pgn files are not included in this git repo because they are too big. Download them from [lichess](https://database.lichess.org/)

# JSON structure

How the output is structured
```
{
    "0": {  # beginner games (elo -1200)
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1": {  # fen
        "b": 212,  # number of black wins in games this fen occured
        "w": 244,  # number of white wins in games this fen occured
        "t": 18,  # number of ties in games this fen occured
        "nxt": {  # next move in long algebraic notation
          "e7e6": 43,  # number of games where this move was played after this fen
          "e7e5": 262,
          "d7d5": 48
        }
      },
      "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2": {
        "b": 22,
        "w": 17,
        "t": 4,
        "nxt": {
          "g1f3": 16,
          "e4e5": 6,
          "d2d3": 2
        }
      },
    "1": {},  # intermediate games (elo 1200-2000)
    "2": {},  # advanced games (elo 2000-2200)
    "3": {}  # expert games (elo +2200)
}
```

