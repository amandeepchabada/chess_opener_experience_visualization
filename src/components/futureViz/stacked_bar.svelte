<script>
    export let aggNextMove;  // aggreagate next move (sum over levels)
    export let nextMovesArr;  // array of moves and counts: eg {"move": "b2g2", count: 42}
    export let nextMovesTotal;  // total sum of next moves

    const colors = ['#3d5599', '#ffe', '#f44', '#f1e', '#ee1', '#3d5599', '#ffe', '#f44', '#f1e', '#ee1', '#3d5599', '#ffe', '#f44', '#f1e', '#ee1'];

    function showTooltip(evt, move, count) {
        let tooltip = document.getElementById("tooltip");
        tooltip.innerHTML = `Next move: ${move}, # Played ${count} or ${Math.round(count/nextMovesTotal*100)}%`;
        tooltip.style.display = "block";
        tooltip.style.left = evt.pageX + 10 + 'px';
        tooltip.style.top = evt.pageY + 10 + 'px';
    }

    function hideTooltip() {
        var tooltip = document.getElementById("tooltip");
        tooltip.style.display = "none";
    }

    const h = 560;  // height
</script>

<svg width='100px' height={h} >
    <g class='bars'>
        {#each nextMovesArr as {move, count, accCount}, i}
            <g  id={`bar-${move}`} class='bar'
                on:mouseenter={(evt)=>showTooltip(evt, move, count)} 
                on:mousemove={(evt)=>showTooltip(evt, move, count)} 
                on:mouseleave={hideTooltip} >
                <rect fill={colors[i]} width='100%' height='{count/nextMovesTotal*100}%'
                    transform="translate(0,{(accCount-count)/nextMovesTotal*h})"
                />            
                {#if count/nextMovesTotal*h > 20} 
                <!-- if larger than 20 pixels, show label -->
                    <text transform="translate(30,{((accCount-count)+count/2)*h/nextMovesTotal+5})">
                        {move}
                    </text>
                {/if}
            </g>
        {/each}
    </g>
</svg>
{#if true || showTooltip}
    <div id="tooltip" display="none" style="position: absolute; display: none;"></div>
{/if}


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