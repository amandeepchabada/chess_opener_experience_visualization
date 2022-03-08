<script>
  	import { onDestroy } from 'svelte';
    import {gameDataStore, initial_fen  } from '../../state';

    let posData = [];  // Use this variable -- sincerely, Brett
    const unsubscribeFen = gameDataStore.subscribe(new_fen => {
        posData = new_fen;
    });
    onDestroy(unsubscribeFen);  // prevent memory leak

    const test_fenData = [
        {"id": 0, "name": "Beginner", "b": 105023, "w": 215498, "t": 42, "nxt": {"e7e6": 1, "g8f6": 1 }},  // beginner
        {"id": 1, "name": "Intermediate", "b": 15, "w": 115498, "t": 9263, "nxt": {"e7e6": 1, "g8f6": 1, "f7f5": 9, "b8a6": 1, "d8e7": 2 }}, // intermediate
        {"id": 2, "name": "Advanced", "b": 105023, "w": 584984, "t": 66, "nxt": {"e7e6": 1, "g8f6": 1 }},  // advanced
        {"id": 3, "name": "Pro", "b": 0, "w": 315498, "t": 23263, "nxt": {"e7e6": 1, "g8f6": 1 }},  // pro
    ];

    console.log("test",test_fenData)
    let Total =[];


    for( let i =0; i< test_fenData.length; i++){
        Total.push({"total" : [test_fenData[i].b +test_fenData[i].w+ test_fenData[i].t]});
        
    }
   

    console.log("Total",Total)
</script>

<div align="center" class='container'>
    <h1>
        Game Results by Experience Level 
    </h1>
  
  
  <div class='container1' >
      
    <!-- {#each test_fenData as t,i}
    <div class="row">
        
        <div class="label">
          <p text-align= "right" >{t.name}</p> 
        </div>
        <div class="bar-container">
          <div class="bar val-a" style="flex-basis: 20%">50%</div>
          <div class="bar val-b" style="flex-basis: 30%">30%</div>
          <div class="bar val-c" style="flex-basis: 50%">50%</div>
        </div>
      </div>
      {/each} -->

      <div class="row">
        
        <div class="label">
          <p text-align= "right" >Beginner</p> 
        </div>
        <div class="bar-container">
          <div class="bar val-a" style="flex-basis: 20%">20%</div>
          <div class="bar val-b" style="flex-basis: 30%">30%</div>
          <div class="bar val-c" style="flex-basis: 50%">50%</div>
        </div>
      </div>

      <div class="row">
        
        <div class="label">
          <p text-align= "right" >Intermediate</p> 
        </div>
        <div class="bar-container">
          <div class="bar val-a" style="flex-basis: 50%">50%</div>
          <div class="bar val-b" style="flex-basis: 10%">10%</div>
          <div class="bar val-c" style="flex-basis: 40%">40%</div>
        </div>
      </div>

      <div class="row">
        
        <div class="label">
          <p text-align= "right" >Advanced</p> 
        </div>
        <div class="bar-container">
          <div class="bar val-a" style="flex-basis: 10%">10%</div>
          <div class="bar val-b" style="flex-basis: 60%">60%</div>
          <div class="bar val-c" style="flex-basis: 30%">30%</div>
        </div>
      </div>


      <div class="row">
        
        <div class="label">
          <p text-align= "right" >Pro</p> 
        </div>
        <div class="bar-container">
          <div class="bar val-a" style="flex-basis: 5%">5%</div>
          <div class="bar val-b" style="flex-basis: 15%">15%</div>
          <div class="bar val-c" style="flex-basis: 80%">80%</div>
        </div>
      </div>

    
    </div>
   
    <h1 align="center" font-size= "28"> Position Popularity by Experience Level </h1>
    <svg height= "200px" transform= "translate(20, 0)" >
      <g transform= "translate(0,   25 )"> 
      
        <g transform= "translate(0,   25 )"> 
        {#each test_fenData as t,  i}
            <g transform= {`translate(100, ${ i * 35 })`}>
                <rect  width="{t.w/1000}" height = "30" fill = "darkgray" />
                <text  text-anchor="end" dominant-baseline= "middle" x="-5" y="15">{t.name}</text>
                <text  fill= black dominant-baseline= "middle" x={t.w/1000- 75} y="15">{t.w/10000} %</text>

            </g>  
        
        {/each}
    </g>  
    </g> 
    </svg>

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
</style>