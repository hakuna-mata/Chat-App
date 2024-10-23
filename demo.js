let lastTypingTime = new Date().getTime()
setTimeout(()=>{
    let timeNow = new Date().getTime()
    let timeDIff = timeNow-lastTypingTime
    console.log(timeDIff); 
},3000)
