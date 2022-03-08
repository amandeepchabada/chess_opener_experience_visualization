<script>
	import { draw } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
    import {genColor, colorByPieceStore} from '../../state';

    export let tooltipData;
    export let nextMovesTotal;
    export let aggNextMove;
    export let nextMovesArr;
    export let nextMovesTotal2;
    export let aggNextMove2;
    export let nextMovesArr2;
    export let sizing;

    $: ({san, count, fen, accCount, curves} = tooltipData);
    const {w, h, bw, th} = sizing;
    const colors = ['#3d5599', '#ffe', '#f44', '#f1e', '#ee1', '#3d5599', '#ffe', '#f44', '#f1e', '#ee1', '#3d5599', '#ffe', '#f44', '#f1e', '#ee1'];

    function calcVertCent(acc, cnt, total) {
        // calculate vertical center
        return ((acc-cnt)+cnt/2)*h/total + th
    }
    $: vc_selected = calcVertCent(accCount, count, nextMovesTotal);
    $: barHeight = count/nextMovesTotal*h;
    const xmin = bw;
    const xmax = w-bw;

    // example of path curves
    // [ 
    //     {x1: xmin, y1: vertical_center, x2:xmax, y2: vertical_center, t: count, c:'blue'},
    //     {x1: xmin, y1: vertical_center, x2:xmax, y2: vertical_center/2, t: (nextMovesTotal-count)*2/3, c:'yellow'},
    //     {x1: xmin, y1: vertical_center, x2:xmax, y2: vertical_center*2, t: (nextMovesTotal-count)*1/3, c:'green'},
    // ];
    $: paths = curves;

    function color(path) {
        if ($colorByPieceStore) return genColor({san: path.c.san});
        return genColor({i: path.c.i});
    }

</script>


<g  id={`bar-${san}`} class='bar'>
    {#each paths.reverse() as path, i_p}
        <!-- bezier curve to make flow-diagram-like info -->
        <path  
            transition:draw="{{duration: 300, delay: (paths.length-i_p)*100}}"
            d={`M${path.x1},${path.y1} C0${w},${path.y1} 0,${path.y2} ${path.x2},${path.y2}`} 
            fill="none" stroke={color(path)} stroke-width={path.t}
        />
    {/each}
</g>



<style>
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