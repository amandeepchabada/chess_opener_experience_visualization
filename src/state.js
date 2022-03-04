import { writable, derived } from "svelte/store";
// import * as game_data_10M from './games_2022_10000000.json';
// import * as game_data_1M from './games_2022_1000000.json';
// TODO filter to reduce filesize and use all data import * as game_data_69M from './games_2022_3000000.json.json';

// TODO games removed because they take forever to load, using real fake data instead
export const game_data = {}; //game_data_1M; // change if more data is needed

export const initial_fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 0";
export const test_fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"; 
export const curr_fen = writable(initial_fen); // TODO: ensure initial_fen is used at some point in the future

const test_fenData = [
    {"b": 105023, "w": 115498, "t": 42, "nxt": {"e7e6": 1, "g8f6": 1 }},
    {"b": 15, "w": 115498, "t": 9263, "nxt": {"e7e6": 1, "g8f6": 1, "f7f5": 9, "b8a6": 1, "d8e7": 2 }},
    {"b": 105023, "w": 984984, "t": 66, "nxt": {"e7e6": 1, "g8f6": 1 }},
    {"b": 0, "w": 115498, "t": 9263, "nxt": {"e7e6": 1, "g8f6": 1 }},
]
export const fenDataStore = derived(  // array of level objects
    curr_fen, 
    $curr_fen => {
        console.log('setting new fen', $curr_fen)
        if ($curr_fen == initial_fen) return test_fenData;  // do not change if set to first move
        return Array(4).map((_, i) => {
            if (game_data[i.toString()] == undefined){
                window.alert('New fen not recognized:' + $curr_fen);
            }
            return game_data[i.toString()][$curr_fen]  // grab all 4 items
    })},
    test_fenData  // initial value
)


// // export let fen_data_obj = {}  // switched to array to make {#each} loops easier
// const unsubscribeFen = curr_fen.subscribe(new_fen => {
//     if (obj["key"] !== undefined)  // field exists
//     {
//         fen_data_arr = Array(4).map((_, i) => game_data[str(i)][new_fen])  // extract levels into array
//         fen_data_obj = Object.assign({}, fen_data_obj); // array into object
//     }
// })
// onDestroy(unsubscribeFen);  // prevent memory leak