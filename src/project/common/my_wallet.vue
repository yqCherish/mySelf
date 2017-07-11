<template>
  <div>
    <!--<loading v-if="loading" style="text-align: center"></loading>-->
    <div>
      <div style="background-color:#ad7de7;padding:30px 15px">
        <div style="color:white;float:left">当前账户余额</div><div style="float:right;color:white">限额5W</div>
        <div style="clear:both;color:white;text-align: center"><span style="font-size:30px;">￥{{total_price}}</span>元</div>
      </div>
      <group gutter="10px">
        <cell v-for="item in cell_list" :key="item" :link="item.url" :title="item.title" is-link>
          <img slot="icon" width="20" style="display:block;margin-right:5px;" :src="item.img">
          <!--<img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../common/img/支付密码.png">-->
        </cell>
      </group>
    </div>
  </div>
</template>

<script>
  import loading from '@/components/loading/dataLoading';
  import {setTitle} from '@/common/js/common';
  import {Group,Cell} from 'vux';

  export default{
    data(){
      return{
        loading:true,
        total_price:"",
        cell_list:[
          {
            url:"my_paylist/1",
            title:"物业缴费",
            img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFCUlEQVRoge2aW2xURRjHf3u2N+idtEJLL2Cx2y5Rg5bEIA2ttwSsxYQYkFixNLaoL6K+aDQmRF6MiqiBtmAxhYSLxpC2IT7UgBovsZogyG5bae2FlhSsvdO6tLs+fFu2y57TPXtptyb+nnbPzHzn/83MN/PN7BoclUzzBLAbWAvEsDAZBZqAD4AGAMVZ8A5QBxSycMWDaCsE6hHNGByVFDkf/BcpVoBXQq0iAHYrQF6oVQRAngLEhlpFAMQq3ussbELnQPL9sOEwPNMNW62w4km/zBgclTiCLE2bsGhYtQ3MuyD5ttCbmoBj6TDxl28mgyhPm0QzmF+A7BKIiFevY4yC7B1w4X2fTM/dCBgjYeUW6e2UfH1thlrhRA74ICn4IxCXBeYKMJVCVJJvbeOzIXUD9J7T3SQ4DihhkFEEq1+EtEcAg/+2csvn0YGYdMgpk5cuTgnI1C3u3ALfJ+kOZt8dMCiQ9pjM7cwiMBh9NjErSoQE8+/7ITrttkIHjPWC/aZLju4gXnQHmHaCuRxiVwZRsQpDrXDSDNvbISbDvcw2CI1PQ/dXgB4HUgsgt0KGVgmfI8Uq1BfCsnxYu8ez7O+L8Pk9gNYUikgA0w4Rnpg7lzK1yS2Hn16DvLc9p2l43K2P7qlEch4UHIGSXlj3YejEg4z4lA06G2at5hqB1S/B+k/mWpY+bo7AH8dkylqrYcVmzaouB+59dT6kzU7/ebh0EC4fFycAuvtgtMszmJ24HLBPzodETybHoe0kWA7CtZ89yx12sB5WD2ZmxkDH6bmSqM6AFX54GY6mwrlSdfHTtNSIIyq4HLBU4UsS5Rd2m0yPugI4ZYaL+2Vd98ZEP3SdUS1yTaHhNrjSCGmPBkntDIbbwVoFLZ/B+DV9bSLiIftZSQw7GySYM4s8qrnvA9aq4DngmILOegnKnkbNKeBB8lpJU1Ztg7DFrudNb0mcKu6S3b911MF4Hyxa6r/wsSsSdM2HJG/RQ1g03LVdhCfdp1LBIDmY4rnvuj+x34TmT2HNGz6qdkhuYqmS4XZM6Wu25G4RnV0C4VqXIw44/y5kPK5a6umStRrWvI6unH68D5prpM1Ihz7RxijIekqEL12nXc82DK21YDkgth8+Dv2/SdkN18iqJ3ObzkD6Rm3jvWfBUgl/npaVRQ/x2c6T2nMQuUS73vVfZU+4fAImx7yaVU/mLNWeDvwzIKuItQoGW/SJVsLlusS8C5Y/pF1v8oYIthwQB3xA3YGuBhjrgejl0Pej9HbbKbn60ENspmSTOWWzLwgDlyRuWmvBNuST8GnUHbBPwrcVMNYN/Rf0WTIYIWOT9HbGRjRjyG6D9i+kU65+55dot9cGfK0SnQqmMsh9Xs7IWgy3SbA318hqF5no/zsddknw8PtQb5DbB/MuyCxWXZ/lRVOyt1gqoedruR968CPn6S7CT/XIdDuSAPjqQFQS5OyU+R2XpV1v5mY2ZZND+vqPZSUKBjMO9focSMmXq8FZe256M6uWRWDZenjgvcB7W43W2lsfvceAqRQKarTLJ67L7m09JEmbEiGiE0zBkuvOYIssuU7Z3kegs0GWT2OU+/Or38jcbv/SfTObTpnnCe8OTFyHxq2QtwfCY5ypbZUcSBYA8/v7wBzw/09MoUYBRkItIgBGFeCXUKsIgCYF2BdqFQGwT0H+J7E31Er8YC9QPx3EbwKbgbOA92NQ6BhDNBYjmvkXj6mJ9Tl5Z5EAAAAASUVORK5CYII="
          },{
            url:"wallet_record",
            title:"消费记录",
            img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACXklEQVRoge2asWtTURSHvz4CDaGpFLRDBUFsEbEPHJpaEJWgIgUbh4JzoA4OLhW3urRYQcT2TzAoji6J6CIGOyldCnUp1KVDhzqU0hR0qsNpe01UXu7LuXl5+L7l3fvuyTu/c+8954WbdO1PzXLABDAN5IAeOpMasAwsAG8BvIOBx0AZyNO54kG05YEKopkUcAuYiVBUWGaALx7wIGolLTCdAkYCzfxBKBbgWJt2104NSmVYXQ+yHPGAbOAD2ykexFex0Ixl1gu2ob3iLX02F0AHE/sAUipP+fET7j+V9mQexi//afOyDEsr0p67BwP9Kq51ViDdDVcuSPtNFTa36sc3t4z4s6fUxIPmFro+ZtofPteP/d4fv6TmEjQDGOg3q7C0YlahcfaHh9RcgnYS37kJvRlpv34nV4ezD9oBpLvhxkVpr23Ap2Wnsw8uymh+1KzCq/fm/uQ1dVegVUYBnpVk1v/Fkxdy7c3AwkM1t8mL7IjR8zB8xvS/fpMVOXkcxnxzP5NWcwmaAVzN1fe/b0sAPZm/v5mVcJ8Daxtwd870kxyoJ8mBI2KfA42cOw0n+tRnvBF3AeT8YBsFYp/ESQBRY5cDq+ty4LRTc6Pm8DzIH2z6I3Yr4FI8mBM5C2K/hewCKE64PaXry4oPC+xywB+C5511mP2fbaEOxH0ZDVEabXBfRkOURhtiv4Xcl9EQpdGGpIxGTXMBuPz+06JPD9gNtCpV2hvE9q74DKbWtT81+xH5+T6OVD1gMWoVLbDoIX+cmI9aSQjmgcphEj8CbgNVYC8yScHsIRoLiGZ+AezPkyaFwPdUAAAAAElFTkSuQmCC"
          },{
            url:"wallet_pay?type=1",
            title:"充值",
            img:"data:image/png;base64,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"
          },{
            url:"wallet_code",
            title:"设置密码",
            img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEGUlEQVRoge2aXWgcVRTHfzM7O9nsJmkaQ2wiNTY1Uaw1JhKEhD6kKAVJW2qxVPFBMCBVRHyxSKovqSYPmqIg9KEF3wwJWog+CIZGCtZiPxDpRxptSootTXETk51JptmP8WHWJLPZJTN3Z7NdyP9tZs6d+/+fe8+599wZiYEpktgNvA+0ACU8mNCA80Af8AOAnHxwFBgC2nlwyYPFrR34HoszEgNTHckbWUMCdlYp7HtEpbVSoTYoU6FKTC+Y3JpL8Gs4xqnbUYbvRUmYXvTIHomBqdNYqrLCrk1++hqLearMt6rtaCTO4T/mGboTzbbbEYmBqVmgVPQNigRfNgU5tLXIddsTN+/zzqU5FhKivRNRyIK8T4LvWkvYXeMXat+5pYiagMy+s5qoiFJFqFkSnzUG05K/qSf45tYCv4Rj/HPfpLJI4vkKhddrVepCss32pWo/Xzwb5NClOSEOEgNTQuG0o1LhTLt98BImdF2ep2/MSOtRRYL36gP0PlOMItmfvXhGY3jSfUzIq5ukR8/24hX3DpzT6R1NTx4gZsLnYwb7z2orstCnTweEeAgJ2Fbmo63SPvv6xgy+/XvBUfuhO1F6Rw3bvZYKhec2rp7BUiEkoCNl3htxk+6rRgbr9OgZNYjE7MPQUe0+GQgJaCq3e+qnyRj/Rt2FkhYz+fGufc43bXSfU4QEbArYm12LxEVew7VZe7BUB6QMlpkhJKDcb+9oXow/f2n2hlrM/TuEs5AXOHU7yrmwxXomatIz6i6OALJayLKFFjNpG4mwJSRz1zDRY+6XpLwKAGvxu6GJb4byOoW8wLqAfKPgBTjeje6oVDjZEqK+JPeax/UEnRd0Ru6tvjA4ZvNVc3BNyAPUhWSONwcd2Tpm9GhwbWdbQ6mznWnBx4BnAvSoiTQ4jTQ4zckr82ltPv5NX7QZnxHcQKXAMwEhv8RHtSoAnVeNFQTHZ+J0T1gFz8GHfNRtcF+8pIOnU+iNJ5bKwq+v2zdmy6/ffVKsfEwHTwXUbfAtjkL3xMLiKKR6v7VG9axPz4P4cFOQBtWqF7ou6kDuvA85EBDyS3zwuHVK1x+OM/inkTPvQ47S6MGGwOIoHPh9KSN9uN3Z4uQGntYDr56epT+cOT02/hwBoEGVuL633JM+C34h83QEXt6s8sLDS3vD4cko/eE4O0tlXtu8NPfLVPenD5ngqYBX6u0ZZkJPQDhOlSrx5raVR5FeYE1ioD8cp39wevF6PQaWYT0GlqPgYyAVbVUKJ0Kypx5PRU4F7HrM/Yc/tyj4IJaBSL5JZAFNBi44sRzXxc8vRXBl1lHJeV4BjuHgS/1bF+c43hxk6xocrdzQErzt7LPrMSn5t8pRoCunrLzHJ8CR/915BNgLjAB63iitDh2L4x4szvwH8I1RJhZ2Xv8AAAAASUVORK5CYII="
          },{
            url:"my_bankCardList?type=1&show=0",
            title:"绑定银行卡",
            img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACM0lEQVRoge2aMUsjQRiGnxmjNpfCQkUIaRRsBMFkbYSAiN3d+Vu09cqzjb/F87CTa9LELFoEbQSxEVet5BQ0yM0V453OJl683XO/3WOfKt/OBJ43mdmZWVb9qNd55AOwCnjAO9LJDdAC6sBXAP3Y8Bn4AiySXnmwbovANtaZAvAeWBeUiso60NTAmrRJDFY1UJW2iEFVA0VpixgUdf8+6SYPIE2h59VSCeV5MDEBw8MJK4XodCAIMAcHcHLS1dwdoFJB1WpJqL2OoSEol1HlMrRamEbDaXaHUKmULvkwngdTU84lJ4Cam0vUJwphR/cfGB9P0iUaIUc3wOBgkirRKLjTNvO30TyANM6AMltboJSUSyTcGXF2JqQRnf9rCDE7CwMDQip/wf7+749OALWwIL95ewXmWYDMD6E8gDR5AGkyH6D3mfitaTYx19cAqEoF027bsy+g5ucxe3u2n1KopSXQL//OIgHM8TFcXdlichKOjuD+/qk+PHzqXKv9cW3K/BDKA0jjzoFOJ5G9kJqexoyN2WJkBGZm4O7O1qOjtjbGbizD5/SHB6d0AwQBFBN4WO15PD82hZ9FqeXll797fu6UzhAyvm+Tpxjj+07tzoEgwOzupjaEaTTg9NS51r0OtNuYiwtUtZq+h7s9jry9F7LLS8zOzlur/RMyfxvNA0ijge/SEjG40YDft1t6aWlgU9oiBpsa++LEhrRJBDaA7V+T+BOwAnwDbsWU+nOLdfyIdeYnO2d+S8rrB9AAAAAASUVORK5CYII="
          },{
            url:"bill_page",
            title:"开票信息",
            img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEHUlEQVRogeWabUxbVRjHf/eug4UWRwwMujg3BzFE1w0GDDQxkZksxgCr3/xgzALbEl0wMjYIIoQlwzmy2Swm6lSciy+JMdnINnXug1MQ9tLh3BAXmG4qiPJSqVBaaG9v/VCsqaOX9bZQ7vx96/Oc5/b/733OPaenFYqOm5mmGKgA8gADCxMHYAVeBU4BiNOJvcAJoJCFKx782gqBk/g1owOKgNoYilJLLXBBBHbGWkkEVIhAbqxVRECuCCTGWkUEJIpK2W2mMnSiLvBaQKB0zRZ251YGxQEeXl7AK480Er8oPhDTiTrKs5+jcMWjgZgoiDzzwNNU5VUiIATFt5u2ss1UFnTdraZSRQc6pWSBMZ80fSr7LjYh+2Sez97BY/duBMAQp+flC/uZ8k5hziih9MEtCILAC+vLabIexBCnp2ZDNabkNeSm5nDu9/PoBB27cneSk5oNwOiknbe7mkmMM1Cdt5t1KWsB6Bvv4/TPZzBnlLA5vZh3ut4NqVEoOm72hUo2b3qLZQkpdA5eRvJ5yE/bEJTvGe3lJ/sNnrjv8aD4ZzdPk5WyjuUGYyB2tu8rMu/OxKhPCxrb8uMJ8o15GPX/jpVkL6dufIo5owSA4pYnIzMQa5QMKM4BLXBnG5j0uuZLh2oUDXhleb50qEbxMRqKjoFzuKTJaGshJSGZtcmmsGpUGWj+/j2GnENqShUpMOaHbeDOnsRaQLGF3LJ7xniCLgH9Yn3UxSzRxc8+6D8oGvB4PTPGX9toCfuN5grNt5DmDah6jFa3vciIyxZtLaxflsWOrGfDqlFlYMRlm5N1wD71V9g1ylsJn1e1mPlCeTM3B9uFaPP/nMTNmw5HW4dqNH8HNG9AVQuVf1nBsGs42lrIS8uhMqcirBpFAw7PxIxxp+RkIkQuEialqbBrNN9Cmjegag40PFSHJEvR1oJ+cULYNaoMrEi8R03ZnKD5FlI04JI0frAl+xb+wdZttZBt0nbLwuX2uvn85he3mHRJLo50H8XtDT4QCPVhfNzzCb2j14NiY+4x+sd/ux1psxsYcdmoaaujqrWGX8Z+DYjfc34vr195k/qOPYy7HYB/gatrb+DY9RYOXLLg8/lP7nv+7KXszHbev/Zh4DuGJHs52Gnhg2sfUd/RELj2mHuM2m/q2dVaxXfDV2Y1sOj+pzIbQiWNhjSOdB9lyDmEU3LxdX8b6UmreePqYa4OdwEw6BykfaCD9KTVWDoP0TPaC0C/ox+72459ys4+axMOzwTdth/4dugyq5auxNJ5iIt/XALAI3toH+hg5V2r2G89QN94Hx7ZQ2t/G0lLlmKdHjcTij9waAERGI+1iAhwiEDo+7PwsYrAwjlmCx+LiP+PE42xVqKCRuDkP4/Rl4DNwFkg+hv96DGBX2MJfs38DaYnYeya1oAMAAAAAElFTkSuQmCC"
          }
        ]
      }
    },
    components:{
      loading,Group,Cell
    },
    mounted(){
      setTitle("我的钱包");
      document.getElementById("index_loading").style.display="none";
      let self = this;
      if(service_url){
        if(userProfile.isreg===1&&userProfile.atype===2){
           this.cell_list.splice(3,1);
        }
          /*返回值中有tag，如果tag=1则有密码，tag=0则没有密码*/
        this.$http.get(service_url+"/o2o/assetsv2/wx/my_wallet.do").then((data)=>{
            if(data.body.status===0){
              self.total_price=parseFloat(data.body.data.total_price).toFixed(2);
              this.cell_list[2].url=this.cell_list[2].url+"&pay="+self.total_price;
              if(userProfile.isreg===1&&userProfile.atype===2) {
                console.log("租户");
              }else{
                this.cell_list[3].url = data.body.data.tag === 1 ? this.cell_list[3].url + "?mark=2" : this.cell_list[3].url + "?mark=1";
              }
            }
        });

      }else{
        this.$http.get("api/my_paylist").then((data)=>{
            self.total_price = parseFloat(data.body.data.data.total_price).toFixed(2);
          this.cell_list[2].url=this.cell_list[2].url+"&pay="+self.total_price;
        })
      }
    },
    methods:{

    }
  }
</script>

<style scoped>

</style>
