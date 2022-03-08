<script>
  	import { onDestroy } from 'svelte';
    import {fenDataStore,initial_fen  } from '../../state';
  	import Hoverable from './Hoverable.svelte';
    import { fade, fly } from 'svelte/transition';

    let name = ["Beginner", "Intermediate", "Advanced","Pro"];
    let posData = [];  // Use this variable -- sincerely, Brett
    const unsubscribeFen = fenDataStore.subscribe(new_fen => {
        
        let gameTotal= [  161763, 700261, 444771, 88547]
  
        posData = new_fen.map((level,i) => {
         
          let total = level.b +level.w+ level.t;
          let popularity = Math.round(total / gameTotal[i] *100);
          // console.log({total,i})
          return {bG: level.b, b: Math.round(level.b/total*100) , 
                  wG: level.w, w: Math.round(level.w/total*100) , 
                  tG:level.t , t: Math.round(level.t/total*100),
                  total: total, popularity : popularity,
                  gameTotal :gameTotal};
        });

      
    });
    onDestroy(unsubscribeFen);  // prevent memory leak

 
    console.table({posData})
  
</script>

<div align="center" class='container'>
    <h1>
        Game Results by Experience Level 
    </h1>
  
   
  <div class='container1' >
    <Hoverable let:hovering={active}>
    {#each posData as t,i}
        <div class="row">
          
          <div class="label">
            <p text-align= "right" >{name[i]}</p> 
          </div>
          <div class="bar-container">
            {#if t.b !=0  }
            {#if active}
            <div  class="bar val-a1" style="flex-basis: {t.b}%">{t.bG}</div>
            {:else}
            <div class="bar val-a" style="flex-basis: {t.b}%">{t.b}%</div>
            {/if}
            {/if}
            {#if t.t !=0  }
            {#if active}
            <div  class="bar val-b1" style="flex-basis: {t.t}%">{t.tG}</div>
            {:else}
            <div class="bar val-b" style="flex-basis: {t.t}%">{t.t}%</div>
            {/if}
            {/if}
            {#if t.w !=0  }
            {#if active}
            <div class="bar val-c1" style="flex-basis: {t.w}%">{t.wG}</div>
            {:else}
            <div class="bar val-c" style="flex-basis: {t.w}%">{t.w}%</div>
            {/if}
            {/if}
          </div>
        </div>
    {/each}
  </Hoverable>
    </div>
 
    <h1 align="center" font-size= "28"> Position Popularity by Experience Level </h1>
    <!-- <svg height= "200px" transform= "translate(20, 0)" >
      <g transform= "translate(0,   25 )"> 
      
        <g transform= "translate(0,   25 )"> 
        {#each posData as t,  i}
            <g transform= {`translate(100, ${ i * 35 })`}>
                <rect  width="{t.popularity}" height = "30" fill = "darkgray" />
                <text  text-anchor="end" dominant-baseline= "middle" x="-5" y="15">{name[i]}</text>
                <text  fill= black dominant-baseline= "middle" x={t.popularity- 75} y="15">{t.popularity} %</text>

            </g>  
        
        {/each}
    </g>  
    </g> 
    </svg> -->

    <div class='container1' >
      <Hoverable let:hovering={active}>
      {#each posData as t,i}
          <div class="row">
            
            <div class="label">
              <p text-align= "right" >{name[i]}</p> 
            </div>
            <div class="bar-container">
              {#if active}
              <div class="bar val-{[i]}" style="flex-basis: {t.popularity}%">{t.total} </div>
              {:else}
              <div class="bar val-{[i]}" style="flex-basis: {t.popularity}%">{t.popularity}%</div>
           {/if} 
           </div>
          </div>
      {/each}
    </Hoverable>
    
      </div>


</div>

<style>
    div.container {
        flex: 1;
        min-width: 300px;
 
        background-color: gray;

    }
    div.container1 {
        flex: 1;
        min-width: 300px;
        margin: 35px;
        width: 750px;
        height: 250px;
        background-color: gray;
       
    }
 
    svg {
        border: 1px solid black;
        width: 90%;
        

    }
    .row {
    display: flex;
    align-items: stretch;
    align-items: right;
    justify-content: right;
    outline: solid 1px black;
    }

    .row .label {
    flex: 0 0 120px;

    font-size: 18px;
    
    }

    .row .bar-container {
    flex: 1;
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    }

    .row .bar {
    display: flex;
    justify-content: center;
    align-items: center;
    }

    .val-a { background: black; color: white}
    .val-b { background: lightgray ; color: black}
    .val-c { background: white ; color: black}
    .val-a1 { background: rgb(0, 0, 0); color: rgb(255, 187, 187)}
    .val-b1 { background: rgb(211, 211, 211) ; color: rgb(167, 0, 0)}
    .val-c1 { background: rgb(255, 255, 255) ; color: rgb(167, 0, 0)}
    .val-0 { background:  #ffff99 ; color: black }
    .val-1 { background:  #fdc086; color: black }
    .val-2 { background: #beaed4; color:white }
    .val-3 { background:  #7fc97f; color:white }
</style>