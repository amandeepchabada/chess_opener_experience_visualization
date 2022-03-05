import { writable, derived } from "svelte/store";

export const gameDataStore = writable(false); //game_data_1M; // change if more data is needed

export const initial_fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 0";
export const test_fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";
export const curr_fen = writable(initial_fen); // TODO: ensure initial_fen is used at some point in the future

const test_fenData = [
    {"b": 105023, "w": 115498, "t": 42, "nxt": {"e7e6": 1, "g8f6": 1 }},  // beginner
    {"b": 15, "w": 115498, "t": 9263, "nxt": {"e7e6": 1, "g8f6": 1, "f7f5": 9, "b8a6": 1, "d8e7": 2 }}, // intermediate
    {"b": 105023, "w": 984984, "t": 66, "nxt": {"e7e6": 1, "g8f6": 1 }},  // advanced
    {"b": 0, "w": 115498, "t": 9263, "nxt": {"e7e6": 1, "g8f6": 1 }},  // pro
]

export const fenDataStore = derived(  // array of level objects
    curr_fen, 
    $curr_fen => {
        console.log('setting new fen', $curr_fen)
        if ($curr_fen == initial_fen) return test_fenData;  // do not change if set to first move
        return Array(4).map((_, i) => {  // loop over 4 levels
            if (game_data[i.toString()] == undefined){
                window.alert('New fen not recognized:' + $curr_fen);  // throw user visible error
                return test_fenData;
            }
            return game_data[i.toString()][$curr_fen]  // grab data for level
    })},
    test_fenData  // initial value
)
