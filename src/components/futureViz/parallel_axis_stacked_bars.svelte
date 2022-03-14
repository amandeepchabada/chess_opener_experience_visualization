<script>
    import StackedBar from './stacked_bar.svelte';
    import NextMoveGraph from './next_move_graph.svelte';
    import { gameDataStore, selectedSquare } from '../../state';

    export let aggNextMove;  // aggreagate next move (sum over levels)
    export let nextMovesArr;  // array of moves and counts: eg {"move": "b2g2", count: 42}
    export let nextMovesArrDict;
    export let nextMovesTotal;  // total sum of next moves
    export let aggNextMove2;  // aggreagate next move (sum over levels)
    export let nextMovesArr2;  // array of moves and counts: eg {"move": "b2g2", count: 42}
    export let nextMovesTotal2;  // total sum of next moves
    export let nextMovesArrDict2;
    export let h; // height
    export let w; // width

    let tooltipIsShown;
    let tooltipData;
    function showTooltip(evt, {san, count, fen, accCount, prevFens}) {
        selectedSquare.set(san.slice(-2));

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
            // two move bar is selected
            const vCentCurr = vc(accCount, count, nextMovesTotal2);
            curves = Object.entries(prevFens).map( ([prevFen, countPrevFen]) => {
                const {accCount: accCntNxt, count: cntNxt, san, i} = nextMovesArrDict[prevFen]
                //console.log({prevFen, aggNextMove});
                const vCentNext = vc(accCntNxt, cntNxt, nextMovesTotal); // vertical center of previous move
                return {
                    x1: xmin,
                    x2: xmax,
                    y1: vCentNext,
                    y2: vCentCurr,
                    san: san,
                    i: i,
                    t: (countPrevFen)/nextMovesTotal2*h,
                }
            });
            // curves.push({
            //     x1: xmin,
            //     x2: xmax/2,
            //     y1: vOffset,
            //     y2: h-thickness/2,
            //     t: thickness,  
            //     c: 'darkgray',
            // });
        }
        else {
            // next move bar selected
            // need list of next fens
            const fullFenDataNxtDup = ['0', '1', '2', '3'].reduce((acc, level) => {
                const nxtFensAtLvl = $gameDataStore[level][fen]['nxt'].map(e=>e[0]);
                return [...acc, ...nxtFensAtLvl];
            }, []);
            const nxtFenList = [...new Set(fullFenDataNxtDup)];
            //console.log({nxtFenList, nextMovesArr2, f:nextMovesArrDict2[nxtFenList[0]]})
            
            // translate into curves
            const vCentCurr = vc(accCount, count, nextMovesTotal);
            let vOffsetAcc = accCount - count;  // vertical offset accumulator (avoid overlap in start)
            let acc = 0;
            curves = nxtFenList.map((nxtFen, i) => {
                const nxt = nextMovesArrDict2[nxtFen]; 
                //console.log({nxtFen, nxt})
                const thickness = nxt['count']/nextMovesTotal2*h;
                const vCentNext = vc(nxt['accCount'], nxt['count'], nextMovesTotal2);
                const vOffset = (vOffsetAcc)*h/nextMovesTotal + thickness/2;
                vOffsetAcc += nxt['count'];
                acc += nxt['count'];
                return {
                    x1: xmin,
                    x2: xmax,
                    y1: vOffset,
                    y2: vCentNext,
                    t: thickness,  
                    san: nxt['san'],
                    i: nxt['i'],
                };
            });
            // "other" line
            const thickness = (count - acc)/nextMovesTotal*h;
            const y1 = (accCount)*h/nextMovesTotal - thickness/2;
            curves.push({
                x1: xmin,
                x2: xmax/2,
                y1: y1,
                y2: h+20-thickness/2,
                t: thickness,  
                c: 'gray',
            });
        }
        tooltipData = {san, count, fen, accCount, prevFens, curves};
        console.log({tooltipData})
        tooltipIsShown = true;
    }

    function hideTooltip() {
        selectedSquare.set(false);
        var tooltip = document.getElementById("tooltip");
        tooltip.style.display = "none";
        tooltipIsShown = false;
    }

    const sizing = {
        w: w, 
        bw: 50,
        h: h,
        th: 0,  // title height
    }
    const {th, bw} = sizing;  // overall width

</script>

<svg width={w} height={h+20} >
    <g class='bars-1'>
        <g transform="translate(0,{th})">
            {#if nextMovesArr2.length > 0}
                {#each nextMovesArr as data, i}
                    <StackedBar {data} {i} {sizing} {nextMovesTotal} 
                        {hideTooltip} {showTooltip}/>        
                {/each}
            {:else}
                <text transform="translate(30,20)">No games found</text>
            {/if}
        </g>
    </g>
    <g class='bars-2' transform="translate({w-bw},0)">
        <g transform="translate(0,{th})">
            {#if nextMovesArr2.length > 0}
                {#each nextMovesArr2 as data, i}
                    <StackedBar {data} {i} {sizing} 
                        nextMovesTotal={nextMovesTotal2} 
                        {hideTooltip} {showTooltip}
                    />
                {/each}
            {:else}
                <text transform="translate(-60,20)">No games found</text>
            {/if}
        </g>
    </g>
    {#if tooltipIsShown}
        <NextMoveGraph {sizing} {tooltipData} 
            {aggNextMove} {nextMovesArr} {nextMovesTotal}
            {aggNextMove2} {nextMovesArr2} {nextMovesTotal2}
        />
        <text x={w/2-20} y={h+18}>Other Move(s)</text>
    {/if}
</svg>
{#if true}
    <div id="tooltip" display="none" style="position: absolute; display: none;"></div>
{/if}


<style>
    text {
        font-size: 15px;
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