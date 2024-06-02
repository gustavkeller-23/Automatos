
let timer = 0;
let interval;

setInterval(() =>{
    timer += 1;
  }, 10);

  console.log(timer / 100);

  for(let num = 0; num < 10000; num++){
    console.log(num);
  }

  interval = timer;
  timer = clearInterval(timer)

  console.log(timer);
  console.log(interval);