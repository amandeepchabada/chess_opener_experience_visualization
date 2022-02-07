<script>
    import { curr_fen } from '../../stores';
    import ChessTools from 'chess-tools';

    const eco = new ECO();

    function construct_eco_list() {
        function helper(char, count) {
            return [...Array(count).keys()].map(
                el => el > 9 ? char+el : char+'0'+el
            );
        }
        return [].concat.apply([], ['A', 'B', 'C', 'D', 'E'].map(el=>helper(el, 100)) )  // map and concat
    }

    const eco_list = construct_eco_list()

    function set_eco(eco) {
        
        

        //   TODO fen from eco
        curr_fen.update(eco)
    }

</script>

<div class='container'>
	{#each eco_list as  eco, eco_i}
        <button on:click={()=>set_eco(eco)} id={'eco_btn_'+eco_i}>
            {eco}
        </button>
    {/each}
</div>

<style>
    div.container {
        display: flex;
        flex-direction: row;
        max-width: 99vw;
        overflow-x: scroll;
    }
</style>