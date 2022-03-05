<script>
    export let i;
    export let data;
    export let hideTooltip, showTooltip;
    export let nextMovesTotal;
    export let sizing;
    
    const {w, h, bw} = sizing;
    const {fen, count, accCount, san} = data;
    const colors = ['#3d5599', '#ffe', '#f44', '#f1e', '#ee1', '#3d5599', '#ffe', '#f44', '#f1e', '#ee1', '#3d5599', '#ffe', '#f44', '#f1e', '#ee1'];
</script>


<g  id={`bar-${san}`} class='bar'
    on:mouseenter={(evt)=>showTooltip(evt, data)} 
    on:mousemove={(evt)=>showTooltip(evt, data)} 
    on:mouseleave={hideTooltip} 
>
    <rect width={bw} height='{count/nextMovesTotal*h}'
        transform="translate(0,{(accCount-count)/nextMovesTotal*h})"
        fill={colors[i]}
    />            
    {#if count/nextMovesTotal*h > 20} 
    <!-- if larger than 20 pixels, show label -->
        <text transform="translate(30,{((accCount-count)+count/2)*h/nextMovesTotal+5})">
            {san}
        </text>
    {/if}
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