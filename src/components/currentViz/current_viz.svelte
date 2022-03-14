<script>
  	import { onDestroy } from 'svelte';
    import {fenDataStore,initial_fen  } from '../../state';
  	import Hoverable from './Tooltip.svelte';
    import { fade, fly } from 'svelte/transition';
    import Tooltip from './Tooltip.svelte';
    let name = ["Beginner", "Intermediate", "Advanced","Pro"];
    let posData = [];  // Use this variable -- sincerely, Brett
    const unsubscribeFen = fenDataStore.subscribe(new_fen => {
        
        let gameTotal= [  161763, 700261, 444771, 88547]
    
        posData = new_fen.map((level,i) => {
           let g = [level.b,level.t,level.w];
          let total = level.b +level.w+ level.t;
          let popularity = (total / gameTotal[i] *100).toFixed(2)||0;
          // console.log({total,i})
          return {g:g,bG: level.b||0, b: Math.round(level.b/total*100)||0, 
                  wG: level.w||0, w: Math.round(level.w/total*100)||0 , 
                  tG:level.t ||0, t: Math.round(level.t/total*100)||0,
                  total: total||0, popularity : popularity||0,
                  gameTotal :gameTotal||0};
        });

      
    });
    onDestroy(unsubscribeFen);  // prevent memory leak

 
    console.table({posData})
  
</script>

<div align="center" class='container'>
    <h1>
        Game Results by Experience Level 
    </h1>
    <h3>Eventual outcome for games that reach this position</h3>

  <div class='container1' >

    {#each posData as t,i}
      <Tooltip title= "Game counts for {name[i] || 0}: 

              Black- {t.bG || 0}
              Tie- {t.tG || 0}
              White- {t.wG || 0} ">
        <div class="row">


          <div class="label">
            <p text-align= "right" >{name[i]}</p> 
          </div>
          <div class="bar-container" id = "results-by-exp-bars">
            {#if t.b+t.t+t.w !=0 }
              {#if t.b !=0  }
                <div class="bar val-a" style="flex-basis: {t.b}%"> {t.b}% </div>
              {/if}

              {#if t.t !=0  }           
                <div class="bar val-b" style="flex-basis: {t.t}%">{t.t}%</div>          
              {/if}

              {#if t.w !=0  }            
                <div class="bar val-c" style="flex-basis: {t.w}%">{t.w}%</div>        
              {/if}

              {:else}
              <p> No games found</p>
            {/if}
          </div>
 
        </div>
      </Tooltip>
    {/each}
 
    </div>
 
    <h1 align="center" font-size= "28"> Position Popularity by Experience Level </h1>
    <h3>% of games that reach this position</h3>


    <div class='container1' >
      {#each posData as t,i}
      <Tooltip title="      Game counts: 

      Beginner- {posData[0].total || 0}
      Intermediate- {posData[1].total || 0}
      Advanced- {posData[2].total || 0}
      Pro- {posData[3].total || 0}"> 
        <div class="row">
            
            <div class="label">
              <p text-align= "right" >{name[i]}</p> 
            </div>
         
            <div class="bar-container">
              {#if posData[i].total!=0} 
                <div class="bar val-{[i]}" style="flex-basis: {Math.round(t.popularity/Math.max(...posData.map(p=>p.popularity))*100)||0}%">{t.popularity||0}%</div>
                {:else}
                <p> No games found</p>
              {/if}
            </div>
          </div>
           </Tooltip>
      {/each}

    
      </div>


</div>

<style>
    div.container {
        width: 750px;
        background-color: lightgray;
    }
    div.container1 {
        flex: 1;
        min-width: 300px;
        margin: 35px;
        width: 550px;
        height: 250px;
        background-color: lightgray;
       
    }
 
    .row {
    display: flex;
    align-items: stretch;
    align-items: right;
    justify-content: right;
    outline: solid 1px rgb(61, 61, 61);
    }

    .row .label {
    flex: 0 0 120px;
    background: rgb(95, 88, 88);
    color: white;
    font-weight: bold;
    font-size: 18px;
    border: 3px solid rgba(0, 0, 0, 0.068);

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
    #results-by-exp-bars
    {
      border-radius: 50px;
      margin: 5px;
    }
    .val-a { background-image:linear-gradient(black,rgb(40, 40, 40)); color: white; border-radius: 10px 0px 0px 10px;}
    .val-b { background-image:linear-gradient(rgb(120, 120, 120),rgb(160, 160, 160)); color: black ;}
    .val-c { background-image:linear-gradient(rgb(240, 240, 240),white);  color: black; border-radius: 0px 10px 10px 0px;}
    .val-a1 { background: rgba(0, 0, 0, 0.945); color: rgb(255, 187, 187)}
    .val-b1 { background: rgba(211, 211, 211, 0.932) ; color: rgb(167, 0, 0)}
    .val-c1 { background: rgba(255, 255, 255, 0.959) ; color: rgb(167, 0, 0)}
    .val-0 { background-image:linear-gradient(to right,rgb(106, 56, 5),rgb(173, 138, 86)); color: black ; border-radius: 10px; margin: 5px}
    .val-1 { background-image:linear-gradient(to right,rgb(150, 150, 150),rgb(180, 180, 180)); color: black ; border-radius: 10px; margin: 5px}
    .val-2 { background-image:linear-gradient(to right,rgb(219, 190, 23),rgb(245, 225, 125)); color:black ; border-radius: 10px; margin: 5px}
    .val-3 { background-image:linear-gradient(to right,rgb(154,197,219),rgb(217,235,244)); color:black ; border-radius: 10px; margin: 5px}

</style>