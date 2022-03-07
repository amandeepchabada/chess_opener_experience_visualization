<script>
    import Chart from './parallel_axis_stacked_bars.svelte';
    import {onDestroy} from 'svelte'
    import { gameDataStore, fenDataStore } from '../../state';

    let aggNextMove = {}  // aggreagate next move (sum over levels)
    let nextMovesArr = [];  // array of moves and counts: eg {"move": "b2g2", count: 42}
    let nextMovesArrDict = {}; // dict version of nextMovesArr 
    let nextMovesTotal = 0;  // total sum of next moves
    let aggNextMove2 = {}  // aggreagate next move (sum over levels)
    let nextMovesArr2 = [];  // array of moves and counts: eg {"move": "b2g2", count: 42}
    let nextMovesArrDict2 = {};
    let nextMovesTotal2 = 0;  // total sum of next moves

    const unsubscribeFen = fenDataStore.subscribe(newDataArr => {
        console.log({newDataArr})
        aggNextMove = newDataArr.reduce((previousValue, currentValue, i_reduce) => {
                let newValue = {}
                Object.entries(currentValue['nxt']).forEach(([_, datum], i) => {  // loop over next moves
                    const fen = datum[0];
                    const count = datum[1][0];
                    const san = datum[1][1];
                    const prev = previousValue[fen] ? previousValue[fen][0] : 0; // if not defined, use 0
                    const sum  = parseInt(count) + prev;
                    newValue[fen] = [sum, san];
                });
                return {...previousValue, ...newValue};  // overwrite previous values with new sums
            },
            {} // initial val
        );
        let accCount = 0;  // count previous sums, useful for translating bars
        let tmpMovesArr = Object.entries(aggNextMove)
            .sort((a,b) => b[1][0] - a[1][0]);   // sort by count
        console.log(tmpMovesArr)
        const nextMovesArrAll = tmpMovesArr.map(([fen, [count, san]]) => {  // transform to object from nested arrays
            accCount += count;
            return {san, count, accCount, fen}
        });

        // aggregate moves with fewer than 1% of total into "other"
        const otherMoves = {
            san: 'Other',
            fen: false,
            count: 0,
            prevFens: {}
        }
        const nextMovesArrFilt = nextMovesArrAll.filter(({fen, count}) => {
            if (count*100 > nextMovesTotal2) {
                return true;  // is ok
            }
            // aggregate this move into other
            otherMoves['count'] += count;
            otherMoves['prevFens'] = {
                ...otherMoves['prevFens'],
                [fen]: count,
            }
            return false;  // remove
        });
        nextMovesArr = [...nextMovesArrFilt, otherMoves]; // add other moves
        nextMovesTotal = accCount;
        console.log('Parsed next move viz data:', {nextMovesArr, aggNextMove, nextMovesTotal});

        nextMovesArrDict = nextMovesArr
            .reduce((p, c) => ({...p, [c.fen]: c}), {});

        // get data for 2 moves in the future 
        const nextMovesDataArr = nextMovesArr.map(({fen:fenPrev},i) => {
            // get fens at the levels
            const gameData = ['0', '1', '2', '3'].map(i => {  // loop over 4 levels
                const datum = $gameDataStore[i][fenPrev];
                if (datum == undefined) {
                    console.warn(`While checking future move 2: Fen (${fenPrev}) not recognized for level ${i}`);  // throw user visible error
                    return false;  // will be skipped later
                }
                return datum;
            });
            //console.log({i, gameData});
            return {fenPrev, gameData};
        });

        // aggregate levels and simplify object for each prev fen
        aggNextMove2 = nextMovesDataArr.map(({fenPrev, gameData}, i) => {
            return gameData.reduce((previousValue, currentValue, i_reduce) => {
                if (!currentValue) return previousValue;  // skip falsy data
                let newValue = {}
                Object.entries(currentValue['nxt']).forEach(([_, datum], i) => {  // loop over next moves
                    const fen = datum[0];
                    const san = datum[1][1];
                    const prev = previousValue[fen] ? previousValue[fen]['count'] : 0; // if not defined, use 0
                    const count  = parseInt(datum[1][0]) + prev;
                    newValue[fen] = {count, san, fenPrev};
                });
                return {...previousValue, ...newValue};  // overwrite previous values with new sums
            },{}); 
        }).reduce((prevObj, newItems)=> {
            // combine next fens for each move, combine duplicates
            /* convert from
                   [{[fen]: {count, san, fenPrev}, ...}, // data from move 1
                    {[fen]: {count, san, fenPrev}, ...}, // data from move 2
                    ... ]  // ect
            convert to 
                [{ fen, count (agg), san, fenPrev: {[fen]: count} }, ...]  // by combining matching fens
            */
            // update count and prev fen data for each object in newItems 
            // looking at stuff in prevObj
            // console.log({prevObj, newItems})
            Object.keys(newItems).forEach( key => {
                const newFenCnt = newItems[key]['count'];
                const newFen = newItems[key]['fenPrev'];
                if (key in prevObj) {  // if previous fen exists, grab data
                    console.log('feef', prevObj[key]);
                    newItems[key] = {
                        ...newItems[key],
                        count: newFenCnt + prevObj['count'],
                        prevFens: {
                            ...prevObj[key]['prevFens'],
                            [newFen]: newFenCnt,
                        } 
                    };
                } else {
                    newItems[key]['prevFens'] = {
                        [newFen]: newFenCnt
                    }
                }
            });
            return {...prevObj, ...newItems};  // overwrite any duplicate fen objects with new ones
        }, {});
        console.log({aggNextMove2});

        accCount = 0;  // count previous sums, useful for translating bars
        const tmpMovesArr2 = Object.entries(aggNextMove2)
            .sort((a,b) => b[1]['count'] - a[1]['count']);   // sort by count
        const nextMovesArr2All = tmpMovesArr2.map((s) => {  
            const [fen, {count, prevFens, san}] = s;
            // transform to object from nested arrays
            accCount += count;
            return {san, count, accCount, fen, prevFens}
        });
        nextMovesTotal2 = accCount;
        nextMovesArr2 = nextMovesArr2All;
        nextMovesArrDict2 = nextMovesArr2
            .reduce((p, c) => ({...p, [c.fen]: c}), {});
        // // filter moves with fewer than 1% of total
        // const otherMoves2 = {
        //     san: 'Other',
        //     fen: false,
        //     count: 0,
        //     prevFens: {}
        // }
        // const nextMovesArr2Filt = nextMovesArr2All.filter(({fen, count}) => {
        //     if (count*100 > nextMovesTotal2) {
        //         return true;  // is ok
        //     }
        //     // aggregate this move into other
        //     otherMoves2['count'] += count;
        //     otherMoves2['prevFens'] = {
        //         ...otherMoves2['prevFens'],
        //         [fen]: count,
        //     }
        //     return false;  // remove
        // }); // add other moves
        // console.log(nextMovesArr2Filt, otherMoves2)
        // nextMovesArr2 = [...nextMovesArr2Filt, otherMoves2]; // add other moves
        console.log('Parsed 2 move viz data:', {nextMovesArr2, aggNextMove2, nextMovesTotal2});
    });

    // prevent memory leak(s)
    onDestroy(unsubscribeFen);  
</script>

<div class='container'>
    <Chart h={700}
        {aggNextMove} {nextMovesArr} {nextMovesTotal} {nextMovesArrDict}
        {aggNextMove2} {nextMovesArr2} {nextMovesTotal2} {nextMovesArrDict2}
    />
</div>

<style>
    div.container {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        flex-direction: row;
        flex: 1;
        min-width: 400px;
        background-color: lightgray;
    }
</style>