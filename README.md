# lb4-route-script

An initial script to create LoopBack 4 custom controllers/routes by running `npm run custom-controller --params`

node index.js -q="todo|dsearchtree|get|ut|fza:string,hst:string,ht:string|SELECT distinct(UT), UTB FROM dsearchtree.datecode2 where FZA eq \${fza} and HST eq \${hst} and HT eq \${ht} order by UTB ASC;"

node index.js -q="todo|dsearchtree|get|ut|fza:string,hst:string,ht:string|SELECT distinct(UT), UTB FROM dsearchtree.datecode2 where FZA eq \${fza} and HST eq \${hst} and HT eq \${ht} order by UTB ASC;"
