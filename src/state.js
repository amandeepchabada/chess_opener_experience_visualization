import { writable, derived } from "svelte/store";

export const gameDataStore = writable(false); //game_data_1M; // change if more data is needed

export const initial_fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
//export const test_fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";
export const curr_fen = writable(initial_fen); // TODO: ensure initial_fen is used at some point in the future

export const selectedSquare = writable(false);  // false when nothing selected
export const colorByPieceStore = writable(false);  // for selecting the colorscheme in future moves

const test_fenData = [
    {"b": 105023, "w": 115498, "t": 42, "nxt": {"e7e6": 1, "g8f6": 1 }},  // beginner
    {"b": 15, "w": 115498, "t": 9263, "nxt": {"e7e6": 1, "g8f6": 1, "f7f5": 9, "b8a6": 1, "d8e7": 2 }}, // intermediate
    {"b": 105023, "w": 984984, "t": 66, "nxt": {"e7e6": 1, "g8f6": 1 }},  // advanced
    {"b": 0, "w": 115498, "t": 9263, "nxt": {"e7e6": 1, "g8f6": 1 }},  // pro
]

export const fenDataStore = derived(  // array of level objects
    [curr_fen, gameDataStore], 
    ([$curr_fen, $gameDataStore]) => {
        if (!$gameDataStore) return test_fenData
        console.log('setting new fen', $curr_fen, $gameDataStore)
        const vals = ['0', '1', '2', '3'].map(i => {  // loop over 4 levels
            if ($gameDataStore[i][$curr_fen] == undefined) {
                //window.alert(`New fen not recognized for ${i}: ` + $curr_fen);  // throw user visible error
                return [];
            }
            return $gameDataStore[i][$curr_fen]  // grab data for level
        });
        console.log('new fenDataStore vals',{vals})
        return vals
    },
    test_fenData  // initial value
);
