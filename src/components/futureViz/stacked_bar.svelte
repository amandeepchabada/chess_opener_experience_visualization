<script>
    import { onDestroy } from 'svelte';

    import {colorByPieceStore, curr_fen} from '../../state';
    import {genColor} from '../../utils';

    export let i;
    export let data;
    export let hideTooltip, showTooltip;
    export let nextMovesTotal; 
    export let sizing;
    let tstbool = true;

    const interval = setInterval(() => tstbool = !tstbool, 500);
    onDestroy(() => clearInterval(interval));

    const {w, h, bw} = sizing;
    $: ({fen, count, accCount, san} = data);
    
    function barClicked() {
        curr_fen.set(fen);
        hideTooltip();
    }


</script>

<!-- on:mousemove={(evt)=>showTooltip(evt, data)}  -->
<g  id={`bar-${san}`} class='bar'
    on:mouseenter={(evt)=>showTooltip(evt, data)} 
    on:mouseleave={hideTooltip} 
    on:click={barClicked}
>
    <rect width={bw} height='{count/nextMovesTotal*h}'
        transform="translate(0,{(accCount-count)/nextMovesTotal*h})"
        fill={$colorByPieceStore ? genColor({san}) : genColor({i})}
        stroke={$colorByPieceStore ? 'black' : undefined}
    />            
    {#if count/nextMovesTotal*h > 20} 
    <!-- if larger than 20 pixels, show label -->
        <text transform="translate(18,{((accCount-count)+count/2)*h/nextMovesTotal+5})">
            {san}
        </text>
    {/if}
</g>



<style>
    .bar {
        cursor: pointer;
    }

    #tooltip {
        background: cornsilk;
        border: 1px solid black;
        border-radius: 5px;
        padding: 5px;
    }
</style>