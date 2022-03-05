<script>
    import Chart from './parallel_axis_stacked_bars.svelte';
    import {onDestroy} from 'svelte'
    import { gameDataStore, fenDataStore } from '../../state';
    
    let aggNextMove = {}  // aggreagate next move (sum over levels)
    let nextMovesArr = [];  // array of moves and counts: eg {"move": "b2g2", count: 42}
    let nextMovesTotal = 0;  // total sum of next moves
    let gameData = {};

    const unsubscribeGameData = gameDataStore.subscribe(data => {gameData = data});

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
                    newValue[fen] = [sum, san]
                });
                return {...previousValue, ...newValue};  // overwrite previous values with new sums
            },
            {} // initial val
        );
        let accCount = 0;  // count previous sums, useful for translating bars
        let tmpMovesArr = Object.entries(aggNextMove).sort((a,b) => b[1][0] - a[1][0]);   // sort by count
        console.log(tmpMovesArr)
        nextMovesArr = tmpMovesArr.map(([fen, [count, san]]) => {  // transform to object from nested arrays
            accCount += count;
            return {san, count, accCount, fen}
        });
        nextMovesTotal = nextMovesArr[nextMovesArr.length - 1]['accCount'];
        console.log('Parsed future move viz data:', {nextMovesArr, aggNextMove, nextMovesTotal})
    });

    onDestroy(unsubscribeFen);  // prevent memory leak(s)
    onDestroy(unsubscribeGameData);
</script>

<div class='container'>
    <Chart {aggNextMove} {nextMovesArr} {nextMovesTotal} h={560}/>
</div>

<style>
    div.container {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        flex-direction: row;
        flex: 1;
        min-width: 400px;
        background-color: gray;
    }
</style>