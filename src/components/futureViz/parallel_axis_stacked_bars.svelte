<script>
    import StackedBar from './stacked_bar.svelte';
    import NextMoveGraph from './next_move_graph.svelte';
    import { gameDataStore } from '../../state';

    export let aggNextMove;  // aggreagate next move (sum over levels)
    export let nextMovesArr;  // array of moves and counts: eg {"move": "b2g2", count: 42}
    export let nextMovesArrDict;
    export let nextMovesTotal;  // total sum of next moves
    export let aggNextMove2;  // aggreagate next move (sum over levels)
    export let nextMovesArr2;  // array of moves and counts: eg {"move": "b2g2", count: 42}
    export let nextMovesTotal2;  // total sum of next moves
    export let nextMovesArrDict2;
    export let h; // height

    let tooltipIsShown;
    let tooltipData;
    function showTooltip(evt, {san, count, fen, accCount, prevFens}) {
        let tooltip = document.getElementById("tooltip");
        tooltip.innerHTML = `${san} was played ${count} times (${Math.round(count/nextMovesTotal*100)}%)`;
        tooltip.style.display = "block";
        tooltip.style.left = evt.pageX + 10 + 'px';
        tooltip.style.top = evt.pageY + 10 + 'px';

        let curves;
        const xmin = bw;
        const xmax = w-bw;
        const vc = (acc, cnt, total) => (acc-cnt/2)*h/total + th; // vertical center
        if (prevFens) {
            const vCentCurr = vc(accCount, count, nextMovesTotal2);
            curves = Object.entries(prevFens).map( ([prevFen, countPrevFen], i) => {
                const {accCount: accCntNxt, count: cntNxt, san} = nextMovesArrDict[prevFen]
                console.log({prevFen, aggNextMove});
                const vCentNext = vc(accCntNxt, cntNxt, nextMovesTotal); // vertical center of previous move
                return {
                    x1: xmin,
                    x2: xmax,
                    y1: vCentNext,
                    y2: vCentCurr,
                    t: (countPrevFen)/nextMovesTotal2,
                    c: 'blue',
                }
            });
        }
        else {
            // need list of next fens
            const fullFenDataNxtDup = ['0', '1', '2', '3'].reduce((acc, level) => {
                const nxtFensAtLvl = $gameDataStore[level][fen]['nxt'].map(e=>e[0]);
                return [...acc, ...nxtFensAtLvl];
            }, []);
            const nxtFenList = [...new Set(fullFenDataNxtDup)];
            console.log({nxtFenList, nextMovesArr2, f:nextMovesArrDict2[nxtFenList[0]]})
            // translate into curves
            const vCentCurr = vc(accCount, count, nextMovesTotal);
            curves = nxtFenList.map(nxtFen => {
                const nxt = nextMovesArrDict2[nxtFen];
                console.log({nxtFen, nxt})
                const vCentNext = vc(nxt['accCount'], nxt['count'], nextMovesTotal2);
                return {
                    x1: xmin,
                    x2: xmax,
                    y1: vCentCurr,
                    y2: vCentNext,
                    t: nxt['count']/nextMovesTotal,  // percentage
                    c: 'blue',
                };
            });
        }
        tooltipData = {san, count, fen, accCount, prevFens, curves};
        console.log({tooltipData})
        tooltipIsShown = true;
    }

    function hideTooltip() {
        var tooltip = document.getElementById("tooltip");
        tooltip.style.display = "none";
        tooltipIsShown = false;
    }

    const sizing = {
        w: 350, 
        bw: 50,
        h: h,
        th: 20,  // title height
    }
    const {w, th, bw} = sizing;  // overall width

</script>

<svg width={w} height={h} >
    <g class='bars-1'>
        <text x="0" y="16" class="large">
            White's Moves
        </text>
        <g transform="translate(0,{th})">
            {#each nextMovesArr as data, i}
                <StackedBar {data} {i} {sizing} {nextMovesTotal} 
                    {hideTooltip} {showTooltip}/>        
            {/each}
        </g>
    </g>
    <g class='bars-2' transform="translate({w-bw},0)">
        <text x="-68" y="16" class="large">
            Black's Responses
        </text>        
        <g transform="translate(0,{th})">
            {#each nextMovesArr2 as data, i}
                <StackedBar {data} {i} {sizing} 
                    nextMovesTotal={nextMovesTotal2} 
                    {hideTooltip} {showTooltip}
                />
            {/each}
        </g>
    </g>
    {#if tooltipIsShown}
        <NextMoveGraph {sizing} {tooltipData} 
            {aggNextMove} {nextMovesArr} {nextMovesTotal}
            {aggNextMove2} {nextMovesArr2} {nextMovesTotal2}
        />
    {/if}
</svg>
{#if true}
    <div id="tooltip" display="none" style="position: absolute; display: none;"></div>
{/if}


<style>
    text {
        font-size: 15px;
    }

    .bar {
        cursor: pointer;
    }

    svg {
        display: block;
        margin: auto;
    }

    #tooltip {
        background: cornsilk;
        border: 1px solid black;
        border-radius: 5px;
        padding: 5px;
    }
</style>