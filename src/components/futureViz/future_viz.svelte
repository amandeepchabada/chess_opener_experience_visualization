<script>
    import StackedBar from './stacked_bar.svelte'
    import {onDestroy} from 'svelte'
    import { gameDataStore, fenDataStore } from '../../state';
    
    let aggNextMove = {}  // aggreagate next move (sum over levels)
    let nextMovesArr = [];  // array of moves and counts: eg {"move": "b2g2", count: 42}
    let nextMovesTotal = 0;  // total sum of next moves

    const unsubscribeData = gameDataStore.subscribe(data => console.log({data}))

    const unsubscribeFen = fenDataStore.subscribe(newDataArr => {
        console.log({newDataArr})
        aggNextMove = newDataArr.reduce((previousValue, currentValue, i_reduce) => {
                let sum = {}
                Object.entries(currentValue['nxt']).forEach(([move, count], i) => {  // loop over next moves
                    const prev = previousValue[move] ? previousValue[move] : 0; // if not defined, use 0
                    sum[move] = count + prev;
                });
                return {...previousValue, ...sum};  // overwrite previous values with new sums
            },
            {} // initial val
        );
        let accCount = 0;  // count previous sums, useful for translating bars
        nextMovesArr = Object.entries(aggNextMove).map(([move, count]) => {
            accCount += count;
            return {move, count, accCount, newDataArr}
        }); 
        nextMovesTotal = nextMovesArr.reduce((prev, {move, count, prevCount}) => prev + count, 0);
        console.log({nextMovesArr, aggNextMove, nextMovesTotal})
    })
    onDestroy(unsubscribeFen);  // prevent memory leak
    onDestroy(unsubscribeData);
</script>

<div class='container'>
    <StackedBar {aggNextMove} {nextMovesArr} {nextMovesTotal} h={500}/>
</div>

<style>
    div.container {
        align-items: center;
        justify-content: center;
        flex: 1;
        min-width: 400px;
        background-color: gray;
    }
</style>