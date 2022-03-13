<script>
	import { draw } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
    import {colorByPieceStore} from '../../state';
    import {genColor} from '../../utils';

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
        if (path.c) return path.c; // if given color
        if ($colorByPieceStore) return genColor({san: path.san});
        return genColor({i: path.i});
    }

    function genColorIndex(i) {
        const colors = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#bc80bd','#ccebc5','#ffed6f']
        return colors[i % colors.length]
    }
    function genColorPiece(san) {
        // get piece char from beginning of san
        const colors = {
            'B': '#ffffb3',
            'N': '#bebada',
            'Q': '#fb8072',
            'R': '#80b1d3',
            'K': '#fdb462',
        }
        if (san[0] in colors) return colors[san[0]];
        return '#b3de69'  // for pawns
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